const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("nUSD");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
console.log(`Contract Address: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});