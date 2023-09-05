import { BadRequestException, Injectable } from '@nestjs/common';

import axios from 'axios';
import {
  DISABLED_NETWORKS_IN_CONTRACTS,
  Net,
  Network,
  explorerApiUrls,
} from '@cryptodo/contracts';
import { explorerApiKeys } from 'src/constants';
import { IAbiElement, IAbiElementInput } from './types/abi.types';
import { GetAbiWriteFunctionsDto } from "./dto";

@Injectable()
export class AbiService {
  public async getContractWriteFunctions(
    address: string,
    { network, testnet }: GetAbiWriteFunctionsDto,
  ) {
    //bitgert, aurora 5ire zeta chain not working
    if (DISABLED_NETWORKS_IN_CONTRACTS.MULTISIG_CONTRACT.includes(network)) {
      throw new BadRequestException(
        `Multisig contract is not currently supported by ${network}`,
      );
    }
    const abi = await this.getAbi(network, address, testnet);
    const functions = await this.getWriteFunctionsFromAbi(abi);
    return functions.map((el) => el.name);
  }

  public async getAbi(
    network: Network,
    address: string,
    testnet: boolean,
  ): Promise<Array<IAbiElement>> {
    const params: any = {
      module: 'contract',
      action: 'getabi',
      address: address,
    };
    if (explorerApiKeys[network]) {
      params.apikey = explorerApiKeys[network];
    }
    const net: Net =
      process.env.NODE_ENV === 'production'
        ? testnet
          ? 'testnet'
          : 'mainnet'
        : 'testnet';
    let info;
    if (network === Network.okc) {
      info = await axios.get(
        `https://www.oklink.com/api/explorer/v1/okexchain${
          testnet ? '_test' : ''
        }/addresses/${address}/contract`,
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',

            referer: `https://www.oklink.com/ru/oktc${
              testnet ? '-test' : ''
            }/address/${address}`,
            'x-apikey': explorerApiKeys[Network.okc],
          },
        },
      );
      if (!info.data?.data?.writeContract) {
        throw new BadRequestException('Contract is not verified');
      }
      return info.data.data.writeContract;
    } else {
      info = await axios.get(explorerApiUrls[network][net], {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
    }
    if (!+info.data.status) {
      throw new BadRequestException(info.data.result);
    }
    const abi = JSON.parse(info.data.result || info.data.data);
    return abi;
  }

  public constructArgsWithTypesFromAbiElementInputs(
    inputs: Array<IAbiElementInput>,
  ) {
    return `${inputs
      .map(
        (input) =>
          `${input.type.includes('[]') ? `${input.type} memory` : input.type} ${
            input.name
          }`,
      )
      .join(', ')}`;
  }

  public constructArgsFromAbiElementInputs(inputs: Array<IAbiElementInput>) {
    return `${inputs.map((input) => `${input.name}`).join(', ')}`;
  }

  public getWriteFunctionsFromAbi(abi: Array<IAbiElement>): Array<IAbiElement> {
    return abi.filter(
      (el: any) =>
        el.type === 'function' &&
        ['payable', 'nonpayable'].includes(el.stateMutability),
    );
  }
}
