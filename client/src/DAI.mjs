import React, { useState } from 'react';
import { ethers } from 'ethers';

const DAI = () =>{
    const [amount, setAmount] = useState('');
    const [signature, setSignature] = useState('');

    // Connect to MetaMask
    const connectWallet = async () =>{
        if (window.ethereum){

        }else{
            
        }
    };
};
export default DAI;