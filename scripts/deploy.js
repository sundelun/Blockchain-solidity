// scripts/deploy.js
require('dotenv').config({path: "./scripts/.env"});
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying DAI deposit contract with account:", deployer.address);

    // 2) point at the mock you just deployed (or real DAI on mainnet)
    //const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const tokenAddress = process.env.MOCKDAI.toString();

    // deploy the DAI deposit contract
    const DAI = await ethers.getContractFactory("DAI", deployer);
    const daiDeposit = await DAI.deploy(tokenAddress);
    await daiDeposit.waitForDeployment();

    console.log("DAI deposit contract deployed to:", daiDeposit.target);
  }
  
// Execute the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Deployment failed:", error);
      process.exit(1);
});
  