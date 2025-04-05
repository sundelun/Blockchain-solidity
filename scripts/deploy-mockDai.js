const { ethers } = require("hardhat");
const { parseEther } = require("@ethersproject/units");
async function main() {
  // fetch the deployer's account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying MockDAI with account:", deployer.address);

  // Convert the initial supply to a BigNumber in wei
  const initialSupply = parseEther("1000000").toString();

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
