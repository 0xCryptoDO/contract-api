import { ContractType, Net, Network } from '@cryptodo/contracts';

export interface IUpdateUserInfoParams {
  userId: string;
  contractType: ContractType;
  net: Net;
  network: Network;
}
