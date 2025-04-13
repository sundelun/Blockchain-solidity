// server/index.mjs

import express from 'express';
import { JsonRpcProvider, Wallet, Contract, verifyTypedData } from 'ethers';
import {createServer} from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express()
app.use(cors());
app.use(express.json());
const server = createServer(app);
const PORT = process.env.PORT;

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

// Set up ethers using RPC_URL
const source = new JsonRpcProvider(process.env.RPC_URL)

// Get the MetaDesk Wallet information
const wallet = new Wallet(process.env.OWNER_PRIVATE_KEY, source)

// The deployed solidity address
const contractAddress = process.env.CONTRACT_ADDRESS;

// Token address
const tokenAddress = process.env.DAI_TOKEN_ADDRESS;

// Two functions in solidity
const contractABI = [
    "function depositFor(address user, uint256 amount, bytes signature) external",
    "function withdraw(uint256 amount) external"
];

// For reading the token balance, use a minimal ERC20 ABI
const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)"
];
const tokenContract = new Contract(tokenAddress, ERC20_ABI, source);

// Define EIP-712 Domain and Types
const domain = {
    name: 'DAI',
    version: '1',
    chainId: parseInt(process.env.CHAIN_ID, 10),
    verifyingContract: contractAddress
  };

const types = {
    Instruction: [
      { name: 'user',   type: 'address' },
      { name: 'action', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'uint256' }
    ]
};

// Initialize the smart contract with all the informations
const contract = new Contract(contractAddress, contractABI, wallet);
app.post('/api/process', async (req, res) => {
    try{
        const { message, signature } = req.body;

        // Verify the signature (EIP-712)
        const signer = verifyTypedData(domain, types, message, signature);

        
        // Only allowed onwener to withdraw
        //console.log(message.user, wallet.address.toLowerCase())
        if (message.action === "withdraw" && message.user.toLowerCase() !== wallet.address.toLowerCase()) {
            return res.status(403).json({ error: "Only the owner can withdraw." });
        }

        // Call the smart contract based on the action
        let ans;
        if (message.action === "deposit") {
            console.log("Recovered signer:", message.user, "Amount:", message.amount, "Signature:", signature);
            ans = await contract.depositFor(message.user, message.amount, signature);
          } else if (message.action === "withdraw") {
            ans = await contract.withdraw(message.amount);
          } else {
            return res.status(400).json({ error: "Invalid action" });
        }
        // Wait for transaction to be finished
        await ans.wait()

        // updated new balance by websocket
        const newBalance = await tokenContract.balanceOf(contractAddress);
        io.emit('balanceUpdated', { balance: newBalance.toString() });

        res.json({ success: true, txHash: ans.hash, newBalance: newBalance.toString() });
    }catch(error){
        console.log("Error occured:", error);
        res.status(500).json({ error: error.message });
    }
});

// socket.io connections
io.on('connection', (socket) => {
    console.log("New WebSocket connected:", socket.id);
  
    // When a client connects, send the current balance
    socket.on("requestBalance", async () => {
      try {
        const balance = await tokenContract.balanceOf(contractAddress);
        socket.emit("balanceUpdated", { balance: balance.toString() });
      } catch (err) {
        console.error(err);
      }
    });
  
    socket.on('disconnect', () => {
      console.log("Client disconnected:", socket.id);
    });
  });

server.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
