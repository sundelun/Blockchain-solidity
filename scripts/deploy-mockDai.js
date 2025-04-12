const { ethers } = require("hardhat");
const { parseEther } = require("@ethersproject/units");
const myPrivateKey = "0x824167c96074e9f3d6a51fb685067bbee5351ccf5ac5802e6a67434d714fa456";
async function main() {
  const provider = ethers.provider;
  const deployer = new ethers.Wallet(myPrivateKey, provider);
  console.log("Deploying with custom account:", deployer.address);
  // fetch the deployer's account
  //const [deployer] = await ethers.getSigners();
  //console.log("Deploying MockDAI with account:", deployer.address);

  // Convert the initial supply to a BigNumber in wei
  const initialSupply = parseEther("1000000").toString();

  // Get the contract factory for MockDAI
  const MockDAI = await ethers.getContractFactory("MockDAI", deployer);
  
  // Deploy the contract with the initial supply
  const mockDAI = await MockDAI.deploy(initialSupply);

  //await mockDAI.transfer("0x0416DF152c5eB7d975eED0333098711ca2B0eE1E", parseEther("100").toString());

  await mockDAI.waitForDeployment();
  
  console.log("MockDAI deployed to:", mockDAI.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
