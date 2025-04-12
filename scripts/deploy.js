// scripts/deploy.js
const myPrivateKey = "0x824167c96074e9f3d6a51fb685067bbee5351ccf5ac5802e6a67434d714fa456";
async function main() {
    const provider = ethers.provider;
    const customSigner = new ethers.Wallet(myPrivateKey, provider);

    console.log("Deploying DAI contract with custom account:", customSigner.address);

    const DAI = await ethers.getContractFactory("DAI", customSigner);
  
    // The DAI token to deploy
    const dai = await DAI.deploy("0x6B175474E89094C44Da98b954EedeAC495271d0F");
  
    // Wait for deployment to be mined
    await dai.waitForDeployment();
  
    console.log("DAI contract deployed to:", dai.target);
  }
  
// Execute the deployment script
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Deployment failed:", error);
      process.exit(1);
});
  