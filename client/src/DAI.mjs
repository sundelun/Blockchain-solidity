import React, { useState } from 'react';
import { ethers } from 'ethers';

const DAI = () =>{
    const [action, setAction] = useState('deposit');
    const [amount, setAmount] = useState('');
    const [signature, setSignature] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    // Connect to MetaMask
    const connectWallet = async () =>{
        if (window.ethereum){

        }else{

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
            <div>
                <label>Action</label>
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                </select>
            </div>
        </div>
    );
};
export default DAI;