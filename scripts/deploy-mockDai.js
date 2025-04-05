const { ethers } = require("hardhat");
const { parseEther } = require("@ethersproject/units");
async function main() {
  // Get the deployer's account (this will be the default account from Hardhat)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying MockDAI with account:", deployer.address);

  // Convert the initial supply to a BigNumber in wei (assuming 18 decimals)
  const initialSupply = parseEther("1000000").toString(); // 1,000,000 tokens

  // Get the contract factory for MockDAI
  const MockDAI = await ethers.getContractFactory("MockDAI");
  
  // Deploy the contract with the initial supply
  const mockDAI = await MockDAI.deploy(initialSupply);
  await mockDAI.waitForDeployment();
  
  console.log("MockDAI deployed to:", mockDAI.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
