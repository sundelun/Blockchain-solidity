const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("@ethersproject/units");
describe("DAI Deposit Contract", function () {
  // only owner can withdraw, and every user can deposit
  let owner, user;
  let daiDepositContract, mockDAI;
  // parse the acmount to string
  const initialSupply = parseEther("1000000").toString();
  const depositAmount = parseEther("10").toString();

  beforeEach(async function () {
    [owner, user, ...addrs] = await ethers.getSigners();

    // Deploy the MockDAI contract
    const MockDAI = await ethers.getContractFactory("MockDAI");
    mockDAI = await MockDAI.deploy(initialSupply);
    await mockDAI.waitForDeployment();

    // transfer tokens to user for testing deposit
    await mockDAI.transfer(user.address, parseEther("100").toString());

    // Deploy the DAI deposit contract
    const DAI = await ethers.getContractFactory("DAI");
    daiDepositContract = await DAI.deploy(mockDAI.target);
    await daiDepositContract.waitForDeployment();
  });

  // test the functionalities of deposit
  it("should deposit tokens successfully", async function () {
    // User approves the deposit contract to spend tokens on their behalf
    await mockDAI.connect(user).approve(daiDepositContract.target, depositAmount);

    // User deposits tokens
    const tx = await daiDepositContract.connect(user).deposit(depositAmount);
    const receipt = await tx.wait();

    // Iterate over the event to find the deposit event
    let depositEvent;
    for (const log of receipt.logs) {
      try {
        const parsedLog = daiDepositContract.interface.parseLog(log);
        if (parsedLog.name === "Deposit") {
          depositEvent = parsedLog;
          break;
        }
      } catch (e) {
        // catch error
      }
    }

    // Check if deposit is success
    expect(depositEvent, "Deposit event not found").to.exist;
    expect(depositEvent.args.from).to.equal(user.address);
    expect(depositEvent.args.amount.toString()).to.equal(depositAmount);

    // Check if the balance is correct
    const contractBalance = await mockDAI.balanceOf(daiDepositContract.target);
    expect(contractBalance).to.equal(depositAmount);
  });

  // test whether a non-owner can withdraw
  it("should revert when a non-owner attempts to withdraw", async function () {
    // User approves and deposits tokens into the contract
    await mockDAI.connect(user).approve(daiDepositContract.target, depositAmount);
    await daiDepositContract.connect(user).deposit(depositAmount);

    // Attempt withdrawal by a non-owner
    // expect to block withdraw
    await expect(daiDepositContract.connect(user).withdraw(depositAmount))
      .to.be.revertedWith("Only owner can perform this operation");
  });

  // test the functionalities of withdraw
  it("should allow the owner to withdraw tokens", async function () {
    // User first approves and deposits tokens
    await mockDAI.connect(user).approve(daiDepositContract.target, depositAmount);
    await daiDepositContract.connect(user).deposit(depositAmount);

    // Verify the deposit contract holds the tokens
    let contractBalance = await mockDAI.balanceOf(daiDepositContract.target);
    expect(contractBalance).to.equal(depositAmount);

    // Owner withdraws tokens from the deposit
    const tx = await daiDepositContract.connect(owner).withdraw(depositAmount);
    const receipt = await tx.wait();

    // Iterate over the event to find the withdraw event
    let withdrawEvent;
    for (const log of receipt.logs) {
      try {
        const parsedLog = daiDepositContract.interface.parseLog(log);
        if (parsedLog.name === "WithDraw") {
          withdrawEvent = parsedLog;
          break;
        }
      } catch (e) {
        // catch error
      }
    }

    // Check if wirthdraw is success by checking balance
    expect(withdrawEvent, "WithDraw event not found").to.exist;
    expect(withdrawEvent.args.to).to.equal(owner.address);
    expect(withdrawEvent.args.amount.toString()).to.equal(depositAmount);

    // The deposit contract's token balance is now 0
    contractBalance = await mockDAI.balanceOf(daiDepositContract.target);
    expect(contractBalance).to.equal(0);
  });
});
