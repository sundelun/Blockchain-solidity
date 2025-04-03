import React, { useState } from 'react';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';

const DAI = () =>{
    const [action, setAction] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [signature, setSignature] = useState('');
    const [messageData, setMessageData] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');

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
                const provider = new JsonRpcProvider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setWalletAddress(address);
            }catch(error){
                console.error(error);
            }
        }else{
            alert('Unable to connect to MetaMask');
        }
    };

    const signInstruction = async () =>{
        if (!window.ethereum){
            alert('Unable to connect to MetaMask');
            return
        }

        // Ensure wallet is connected
        await connectWallet();
        const provider = new JsonRpcProvider(window.ethereum);
        const signer = provider.getSigner();


    }

    return (
        <div>
            <h2>DAI</h2>
            <button onClick={connectWallet}>
                {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
            </button>
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
        </div>
    );
};
export default DAI;