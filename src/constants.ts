import { Network } from '@cryptodo/contracts';

const isProduction = process.env.NODE_ENV === 'production';

export const compilerVersion = 'v0.8.15+commit.e14f2714';

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const apiUrls = {
  billingApi: isProduction
    ? 'https://billing-api.cryptodo.app'
    : 'https://billing-api.staging.cryptodo.app',
  userApi: isProduction
    ? 'https://users-api.cryptodo.app'
    : 'https://users-api.staging.cryptodo.app',
};

export const explorerApiKeys = {
  [Network.bsc]: process.env.BSCSCAN_API_KEY,
  [Network.ethereum]: process.env.ETHERSCAN_API_KEY,
  [Network.polygon]: process.env.POLYGONSCAN_API_KEY,
  [Network.aurora]: process.env.AURORASCAN_API_KEY,
  [Network.avalanche]: process.env.AVALANCHESCAN_API_KEY,
  [Network.optimism]: process.env.OPTIMISMSCAN_API_KEY,
  [Network.okc]: process.env.OKCSCAN_API_KEY,
  [Network.bitgert]: process.env.BITGERTSCAN_API_KEY,
  [Network.bitTorrent]: process.env.BITTORRENTSCAN_API_KEY,
  [Network.fantom]: process.env.FANTOMSCAN_API_KEY,
  [Network.cronos]: process.env.CRONOSSCAN_API_KEY,
  [Network.arbitrum]: process.env.ARBITRUMSCAN_API_KEY,
  [Network.base]: process.env.BASESCAN_API_KEY,
};
