// server/index.mjs

import express from 'express';
import dotenv from 'dotenv';

const app = express()
app.use(express.json());

const PORT = 3000;

dotenv.config();

const types = {
    Instruction: [
      { name: 'action', type: 'string' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'uint256' }
    ]
};

app.post('/api/process', async (req, res) => {

});