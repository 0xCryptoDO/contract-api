import {
  Network,
  NETWORKS_WITH_DISABLED_VERIFICARION,
  NETWORKS_WITH_ENABLED_TESTNET_VERIFICATION,
} from '@cryptodo/contracts';

//for development purposes only
const NETWORK_ENABLED_VERIFICATION = [];

export const isVerificationEnabled = (contract: {
  testnet: boolean;
  network: Network;
}) =>
  ((!contract.testnet ||
    process.env.IS_TESTNET_VERIFICATION_ENABLED ||
    NETWORKS_WITH_ENABLED_TESTNET_VERIFICATION.includes(contract.network)) &&
    !NETWORKS_WITH_DISABLED_VERIFICARION.includes(contract.network)) ||
  NETWORK_ENABLED_VERIFICATION.includes(contract.network);

export const isSourceCodeEnabled = (contract: {
  testnet: boolean;
  network: Network;
}) => {
  if ([Network.fiveIre, Network.shardeum].includes(contract.network)) {
    return true;
  }
  return isVerificationEnabled(contract);
};
