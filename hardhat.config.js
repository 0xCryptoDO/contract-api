require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  networks: {
    hardhat: {},
  },
  solidity: {
    version: '0.8.15',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: 'src/typechain',
    target: 'ethers-v5',
  },
};
