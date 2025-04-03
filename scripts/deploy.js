// scripts/deploy.js

async function main() {
    const DAI = await ethers.getContractFactory("DAI");
  
    const dai = await DAI.deploy("0x6B175474E89094C44Da98b954EedeAC495271d0F");
  
    // Wait for deployment to be mined
    await dai.waitForDeployment();
  
    console.log("DAI contract deployed to:", dai.target);
  }
  
  // Execute the deployment script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Deployment failed:", error);
      process.exit(1);
});
  