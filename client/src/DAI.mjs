import React, { useState } from 'react';
import { JsonRpcProvider, Wallet, Contract } from 'ethers';

const DAI = () =>{
    const [action, setAction] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [signature, setSignature] = useState('');
    const [messageData, setMessageData] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');

    const domain = {
        name: 'DAI',
        version: '1',
        chainId: 1337,
        verifyingContract: 'xxxxxxx'
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

    const types = {
        Instruction: [
          { name: 'action', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' }
        ]
    };

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

            <div>
            </div>
        </div>
    );
};
export default DAI;