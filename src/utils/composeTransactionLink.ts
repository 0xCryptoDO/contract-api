import { Network, explorerUrls } from '@cryptodo/contracts';

export function composeTxLink(
  network: Network,
  txHash: string,
  testnet?: boolean,
): string {
  const explorerUrl = explorerUrls[network][testnet ? 'testnet' : 'mainnet'];
  return `${explorerUrl}/tx/${txHash}`;
}
