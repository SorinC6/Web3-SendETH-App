require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/NXtQDPWtomD9bp-Bqovqvbp_gM-gVOgU',
      accounts: ['724d16fe783d1bcebe314d8038a322c375f6706ce4afa26d1d8688e04facdaac'],
    },
  }
};
