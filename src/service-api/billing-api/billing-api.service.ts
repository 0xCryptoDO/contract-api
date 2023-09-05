import { IBillingTransaction } from '@cryptodo/contracts';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { apiUrls } from 'src/constants';

@Injectable()
export class BillingApiService {
  public async getUserTransactions(
    userId,
  ): Promise<Array<IBillingTransaction>> {
    const response = await axios.get(
      `${apiUrls.billingApi}/transactions/user/${userId}`,
    );
    return response.data;
  }

  public async getTransactionByContractId(
    contractId: string,
  ): Promise<IBillingTransaction> {
    const response = await axios.get(
      `${apiUrls.billingApi}/transactions/${contractId}`,
    );
    return response.data;
  }
}
