import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiContract, AiContractDocument } from './schemas';

@Injectable()
export class AiContractsService {
  constructor(
    @InjectModel(AiContract.name)
    private multisigContractModel: Model<AiContractDocument>,
  ) {}

  public getAiContracts() {
    return this.multisigContractModel.find();
  }
}
