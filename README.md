# Blockchain-solidity

This repo is designed for design some functionalities of smart contract and interact with frontend and backend. Detailed documentation coming soon...

## Installation
Clone the repository
```shell
git clone https://github.com/sundelun/Blockchain-solidity.git
cd Blockchain-solidity
```
or the ssh method
```shell
git clone git@github.com:sundelun/Blockchain-solidity.git
cd Blockchain-solidity
```

## Setting up the project
A working [node.js](https://nodejs.org/en) is required for the Blockchain-solidity to run locally!

### Setup the smart contract
Install dependencies for smart contracts:
```shell
npm install
```

Then start the hardhat project running via node module(do not stop this process while running)
```shell
npx hardhart node
```

You should see some accounts listing with their account number and private owner key
```shell
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
```

Compile and deploy the smart contract address by running scripts
```shell
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

The expected output should be
```shell
DAI contract deployed to: 0xYOUR_DAI_CONTRACT_ADDRESS
```
Remember the contract address, we need to use it in future.<br><br>

Then run the scripts for deploying token address
```shell
npx hardhat run scripts/deploy-mockDai.js --network localhost
```
The expected output should be
```shell
MockDAI deployed to:0xYOUR_DAI_TOKEN_ADDRESS
```
Remember the token address, we need to use it in future.
<br><br>

### Setup the server side
Create a new terminal window and install dependencies for backend:
```shell
cd server
npm install
```

Create a .env file with following:
```shell
PORT=3001
CONTRACT_ADDRESS=0xYOUR_DAI_CONTRACT_ADDRESS
CHAIN_ID=1337
OWNER_PRIVATE_KEY=0xTHE_OWNER_PRIVATE_KEY_FOR_YOUR_DEPLOYED_ACCOUNT
RPC_URL=http://127.0.0.1:8545
DAI_TOKEN_ADDRESS=0xYOUR_DAI_TOKEN_ADDRESS
```

Start running the backend
```shell
node index.mjs
```
Expected output:
```shell
Backend running on port 3001
```

### Setup the client side
Create a new terminal window and nagivate to the client side and install dependencies for frontend:
```shell
cd client
npm install
```

Create a .env file with following:
```shell
REACT_APP_CONTRACT_ADDRESS=0xYOUR_DAI_CONTRACT_ADDRESS # Same as backend side CONTRACT_ADDRESS
REACT_APP_DAI_TOKEN_ADDRESS=0xYOUR_DAI_TOKEN_ADDRESS # Same as backend side DAI_TOKEN_ADDRESS
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
```

Start running the client side
```shell
npm start
```

Expected output:
```shell
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.22.131:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```
And the browser should be automatically open and you can start playing around it! <br><br>

## Detailed explaination about my implementation
- `server/`: Directory for backend 

- `client/`: Directory for frontend 

- `contracts/`: Directory for Solidity contracts

- `scripts/`: Directory for deploy contracts

- `test/`: Directory for testing functionalities in smart contract

### contracts
- `DAI.sol`: This contract handles the deposit and withdraw implementation. It uses an ERC20 interface to interact with a token by calling `transferFrom` for deposits and `transfer` for withdraw. Only owner can use withdraw method.
- `MockDAI.sol`: Supporting a mock DAI for testing functionalities.

### server
The backend server is built with Express and Socket.IO with file `index.mjs`

- API endpoint(`/api/process`): This endpoint accepts signed instructions from the frontend. It verfifies signature with corresponding function on the deposit contract.
- Websocket communication: The server sets up a Socket.IO connection to real-time updates as the current token balance—to all connected clients in real time.
- Blockchain interaction: The backend uses `ethers.js` from the JSON RPC provider to interact with the deployed smart contracts.

### client
The React frontend provides the user interface, wallet connection and transaction processing.
- MetaMask interaction: The app connects to MetaMask using a `BrowserProvider` from `ethers.js`
- Sign and Send instructions: The user can select whether they want to deposit/withdraw, enter an amount, and then sign an EIP-712 message with their wallet.
- Real-time updates: The frontend also establishes a WebSocket connection to listen for balance updates.

### test
The test directory is to test all the functionalities in smart contracts, such as deposit withdraw deploy and balance after operations is same expected.


<br><br>

## References
Solidity documentation: https://docs.soliditylang.org/en/v0.8.29/#

Video to start workong on solidity project: https://www.youtube.com/watch?v=p6AFi5vpSkc

A great example of contract project implementation: https://github.com/jscriptcoder/lottery-contract

A detailed article explain its project: https://medium.com/@jscriptcoder/my-first-taste-of-building-a-web3-app-with-solidity-react-and-typescript-32660d44e797

A video to setup testing smart contract: https://www.youtube.com/watch?v=36r1nu1aIbc

Syntax fix or version compatible fix: chatgpt/copilot

