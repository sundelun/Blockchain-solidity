// server/index.mjs

import express from 'express';
import dotenv from 'dotenv';
import { ethers } from 'hardhat';

const app = express()
app.use(express.json());

const PORT = process.env.PORT;

dotenv.config();



const source = new JsonRpcProvider(process.env.RPC_URL)

// Get the MetaDesk Wallet information
const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, source)

// The deployed solidity address
const contractAddress = process.env.CONTRACT_ADDRESS;

// Two functions in solidity
const contractABI = [
    "function deposit(uint256 amount) external",
    "function withdraw(uint256 amount) external"
];

// Define EIP-712 Domain and Types
const domain = {
    name: 'DAI',
    version: '1',
    chainId: parseInt(process.env.CHAIN_ID),
    verifyingContract: contractAddress
  };

const types = {
    Instruction: [
      { name: 'action', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'uint256' }
    ]
};

// Initialize the smart contract with all the informations
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
app.post('/api/process', async (req, res) => {
    try{
        const { message, signature } = req.body;

        // Verify the signature (EIP-712)
        const signer = ethers.utils.verifyTypedData(domain, types, message, signature);

        // Only allowed onwener to withdraw
        if (message.action === "withdraw" && signer.toLowerCase() !== wallet.address.toLowerCase()) {
            return res.status(403).json({ error: "Only the owner can withdraw." });
        }

        // Call the smart contract based on the action
        let ans;
        if (message.action === "deposit") {
            ans = await contract.deposit(message.amount);
          } else if (message.action === "withdraw") {
            ans = await contract.withdraw(message.amount);
          } else {
            return res.status(400).json({ error: "Invalid action" });
        }
        // Wait for transaction to be finished
        await ans.wait()
        res.json({ success: true, txHash: ans.hash });
    }catch(error){
        console.log("Error occured:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});