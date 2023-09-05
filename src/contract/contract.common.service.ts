import { Model } from 'mongoose';
import { CreateContractResDto } from './dto/create-contract-res.dto';
import { ContractStatus } from '@cryptodo/contracts';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseContract } from './schemas';

@Injectable()
export class ContractCommonService {
  public async createContract<Params, ContractModel extends BaseContract>(
    userId: string,
    params: Params,
    model: Model<ContractModel>,
  ): Promise<CreateContractResDto> {
    const record = await model.create({
      userId,
      status: ContractStatus.waitingForDeployment,
      ...params,
      createdAt: new Date(),
    });
    return { id: record._id.toString() };
  }

  public async getContractById<ContractModel extends BaseContract>(
    id: string,
    model: Model<ContractModel>,
  ) {
    const contract = await model.findById(id).lean();
    if (!contract) {
      throw new NotFoundException(null, `Contract ${id} does not exists`);
    }
    return contract;
  }
}
