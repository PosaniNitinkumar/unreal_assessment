const { expect } = require("chai");
// const { ethers } = require("hardhat")
const hre = require("hardhat");

// import { ethers } from "ethers";



describe("nUSD", function () {
  let nusdContract;
  let owner;
  let addr1;

  beforeEach(async function () {
    // Deploy the nUSD contract
    const Contract = await hre.ethers.getContractFactory("nUSD");
    nusdContract = await Contract.deploy();
  await nusdContract.waitForDeployment();
  const address = await nusdContract.getAddress();
console.log(`Contract Address: ${address}`);

    // Get signers
    [owner, addr1] = await ethers.getSigners();
  });

  it("should deposit ETH and mint nUSD tokens", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    console.log(`Deposit Amount: ${depositAmount}`);

    // Deposit ETH
    await nusdContract.connect(addr1).deposit({ value: depositAmount });

    // Check the nUSD balance of addr1
    const nusdBalance = await nusdContract.balanceOf(addr1.address);
    const expectedNusdBalance = depositAmount.div(2);
    expect(nusdBalance).to.equal(expectedNusdBalance);
  });

  it("should redeem nUSD tokens and send ETH", async function () {
    const redeemAmount = ethers.utils.parseEther("10");

    // Check the ETH balance of addr1 before redemption
    const ethBalanceBefore = await addr1.getBalance();

    // Redeem nUSD tokens
    await nusdContract.connect(addr1).redeem(redeemAmount);

    // Check the nUSD balance of addr1 after redemption
    const nusdBalanceAfter = await nusdContract.balanceOf(addr1.address);
    expect(nusdBalanceAfter).to.equal(0);

    // Check the ETH balance of addr1 after redemption
    const ethBalanceAfter = await addr1.getBalance();
    const expectedEthBalance = ethBalanceBefore.add(redeemAmount.mul(2));
    expect(ethBalanceAfter).to.equal(expectedEthBalance);
  });
});
