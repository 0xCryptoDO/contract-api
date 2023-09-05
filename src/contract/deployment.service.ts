import {
  ContractStatus,
  IBillingTransaction,
  NETWORKS_WITH_DISABLED_PAYMENTS,
  TransactionStatus,
} from '@cryptodo/contracts';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeployContractDto } from 'src/contract/dto/deploy-contract.dto';
import { BaseContract } from 'src/contract/schemas/base-contract.schema';
import { BillingApiService } from 'src/service-api/billing-api/billing-api.service';
import { Model } from 'mongoose';
import { isSourceCodeEnabled } from 'src/utils/isVerificationEnabled';

@Injectable()
export class DeploymentService {
  constructor(private billingApiService: BillingApiService) {}

  public async checkBeforeDeploy<ContractModel extends BaseContract>({
    contract,
    deployDto,
  }: {
    contract: ContractModel;
    deployDto: DeployContractDto;
  }) {
    if (!contract) {
      throw new NotFoundException(
        null,
        `Contract ${deployDto.contractId} not found`,
      );
    }

    if (contract.status === ContractStatus.deployed) {
      if (deployDto.testnet) {
        if (!contract.testnet) {
          throw new BadRequestException(
            null,
            `Contract ${deployDto.contractId} already deployed to mainnet`,
          );
        }
        if (contract.testnet) {
          throw new BadRequestException(
            null,
            `Contract ${deployDto.contractId} already deployed to testnet`,
          );
        }
      }

      if (!deployDto.testnet) {
        if (!contract.testnet && contract.address) {
          throw new BadRequestException(
            null,
            `Contract ${deployDto.contractId} already deployed to mainnet`,
          );
        }
      }
    }

    if (
      !deployDto.testnet &&
      !NETWORKS_WITH_DISABLED_PAYMENTS.includes(contract.network)
    ) {
      const transaction: IBillingTransaction =
        await this.billingApiService.getTransactionByContractId(
          deployDto.contractId,
        );
      if (transaction?.status !== TransactionStatus.paid) {
        throw new BadRequestException(
          null,
          `Can not deploy contract without paid transaction`,
        );
      }
    }
  }

  public async updateDeployInfo<
    ContractModelDocument,
    ContractModel extends BaseContract,
  >({
    sourceCode,
    deployDto,
    contract,
    model,
  }: {
    sourceCode: string;
    deployDto: DeployContractDto;
    contract: ContractModel;
    model: Model<ContractModelDocument>;
  }) {
    const optionsToSave: Partial<BaseContract> = {
      testnet: deployDto.testnet,
    };
    if (isSourceCodeEnabled({ ...contract, testnet: deployDto.testnet })) {
      optionsToSave.sourceCode = sourceCode;
    }
    return model.updateOne({ _id: deployDto.contractId }, optionsToSave);
  }
}
