import React, { useState, useEffect} from 'react';
import { Wallet, Contract, parseUnits, BrowserProvider, TypedDataEncoder } from 'ethers';
import { arrayify } from '@ethersproject/bytes';
import { io } from 'socket.io-client';

const DAI = () =>{
    const [action, setAction] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [signature, setSignature] = useState('');
    const [messageData, setMessageData] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [response, setResponse] = useState(null);
    const [balance, setBalance] = useState(null);
    const [socket, setSocket] = useState(null);

    // Api used for interact with backend
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
    // EIP-712 Domain 
    const domain = {
        name: 'DAI',
        version: '1',
        chainId: 1337,
        verifyingContract: process.env.REACT_APP_CONTRACT_ADDRESS
      };
    
    const types = {
        Instruction: [
          { name: 'action', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' }
        ]
    };

    // Connect to MetaMask
    const connectWallet = async () =>{
        if (window.ethereum){
            try{
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new BrowserProvider(window.ethereum);

                // Get the signer and address
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setWalletAddress(address);
            }catch(error){
                console.error(error);
            }
        }else{
            alert('Unable to connect to MetaMask');
        }
    };

    // Connect to the backend via WebSocket
    useEffect(() => {
        const socketClient = io(SOCKET_URL);
        setSocket(socketClient);

        socketClient.on('connect', () => {
            console.log('Connected to backend via WebSocket');
        });

        // Listen for balance updates
        socketClient.on('balanceUpdated', (data) => {
            console.log('Balance updated:', data.balance);
            setBalance(data.balance);
        });

        // Listen for any API responses
        socketClient.on('actionResponse', (data) => {
            console.log('Received action response:', data);
            setResponse(data);
        });

        return () => {
            socketClient.disconnect();
        };
    }, [SOCKET_URL]);

    // Sign the instruction
    const signInstruction = async () =>{
        if (!window.ethereum){
            alert('Unable to connect to MetaMask');
            return
        }

        // Ensure wallet is connected
        await connectWallet();

        // Get the informations of wallet
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const nonce = Date.now();
        // Generate the message sent to backend
        const message = {
            action,
            amount: parseUnits(amount, 2).toString(),
            nonce
        };
        setMessageData(message);
        try{
            // Setting the signature
            const digest = TypedDataEncoder.hash(domain, types, message);
            const sig = await signer.signMessage(arrayify(digest));
            setSignature(sig);
            console.log('Signature:', sig);
        }catch (error) {
            console.error('Error occur:', error);
        }
    };

    // Send the signed instruction to backend
    const sendBackend = async () =>{
        if (!signature || !messageData) {
            alert('No signed available now.');
            return;
        }
        try{
            const res = await fetch(`${API_BASE_URL}/process`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageData, signature })
            });
            const data_ans = await res.json()
            setResponse(data_ans);
            console.log('Backend response:', data_ans);
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div>
            <h2>DAI</h2>
            <button onClick={connectWallet}>
                {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
            <div>
                <p>Current Contract Balance: {balance !== null ? balance : "Loading..."}</p>
            </div>
            <div>
                <label>Action</label>
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                </select>
            </div>

            <div>
                <label>Amount: </label>
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <button onClick={signInstruction}>
                Sign Instruction
            </button>
            {signature && (
                <div>
                    <h3>Signed Instruction</h3>
                    <pre>{signature}</pre>
                    <pre>{JSON.stringify(messageData, null, 2)}</pre>
                </div>
            )}
            <button style={{ marginTop: '20px' }} onClick={sendBackend}>
                Send to Backend
            </button>
            {response && (
                <div style={{ marginTop: '20px' }}>
                <h3>Backend Response</h3>
                <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
export default DAI;