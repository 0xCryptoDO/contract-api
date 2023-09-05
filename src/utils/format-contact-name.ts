import { camelCase } from 'lodash';

export function formatContractName(name: string) {
  let contractName = camelCase(name);
  contractName = contractName.charAt(0).toUpperCase() + contractName.slice(1);
  return contractName;
}
