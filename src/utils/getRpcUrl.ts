import { Network, rpcUrls } from '@cryptodo/contracts';
/**
 * Returns RPC url for desired network
 */
export function getRpcUrl(network: Network, testnet?: boolean) {
  return rpcUrls[network][testnet ? 'testnet' : 'mainnet'];
}
