import {
  ContractType,
  Network,
  Quests,
  TESTNET_ONLY_NETWORKS,
} from '@cryptodo/contracts';

export const QUESTS: Quests = {
  [ContractType.erc20Contract]: {
    points: {
      testnet: 10,
      mainnet: 60,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.multisigContract]: {
    points: {
      testnet: 10,
      mainnet: 60,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.airDropContract]: {
    points: {
      testnet: 10,
      mainnet: 60,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.daoContract]: {
    points: {
      testnet: 10,
      mainnet: 60,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.icoContract]: {
    points: {
      testnet: 10,
      mainnet: 60,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.lotteryContract]: {
    points: {
      testnet: 15,
      mainnet: 90,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.erc721Contract]: {
    points: {
      testnet: 15,
      mainnet: 90,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.vestingContract]: {
    points: {
      testnet: 15,
      mainnet: 90,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
  [ContractType.stakingContract]: {
    points: {
      testnet: 15,
      mainnet: 90,
    },
    maxNumberOfCreatedContracts: {
      testnet: 1,
      mainnet: 1,
    },
  },
};

export const MAX_AVAILABLE_POINTS = Object.values(QUESTS).reduce(
  (prev, { maxNumberOfCreatedContracts: maxCreatedContracts, points }) =>
    prev +
    (maxCreatedContracts.mainnet *
      points.mainnet *
      (Object.keys(Network).length - TESTNET_ONLY_NETWORKS.length) || 0) + //all networks except networks without mainnet
    (maxCreatedContracts.testnet *
      points.testnet *
      (Object.keys(Network).length - 1) || 0), //all networks except shardeum
  0,
);

export const referralPointCoef = 0.2;

export const socicalPoints = 20;

export const tweetPoints = 50;
