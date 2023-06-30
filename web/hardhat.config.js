require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/mq4zdmPzOiCODDGtBOqCDFD26S-p8wFP",
      accounts: ["0xcab600bbebb302afd83cd61a0f0ddb8877d08ed349ee61b36510b305c14d1d2f"]
    },
    mainnet: {
      url: "https://eth-mainnet.g.alchemy.com/v2/YeLEL9KmDfmftM9W0j3OWN5Fj7JSblnM",
      accounts: ["0x22d42743be74feae064f13d8fd5e62bffb621b4ad64adcfa13eee588de1df386"]
  }
  }
};
