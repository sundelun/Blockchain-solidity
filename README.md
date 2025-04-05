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
And the browser should be automatically open and you can start playing around it!
<br><br>
## References
Solidity documentation: https://docs.soliditylang.org/en/v0.8.29/#

Video to start workong on solidity project: https://www.youtube.com/watch?v=p6AFi5vpSkc

A great example of contract project implementation: https://github.com/jscriptcoder/lottery-contract

A detailed article explain its project: https://medium.com/@jscriptcoder/my-first-taste-of-building-a-web3-app-with-solidity-react-and-typescript-32660d44e797

Syntax fix or version compatible fix: chatgpt

