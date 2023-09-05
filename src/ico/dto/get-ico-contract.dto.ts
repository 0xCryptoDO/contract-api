import { IICOContract } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetICOContractResDto
  extends GetBaseContractResDto
  implements IICOContract
{
  @ApiProperty({ type: Number })
  version: number;

  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: String })
  price: string;

  @ApiProperty({ type: Number })
  lockup: number;

  @ApiProperty({ type: String })
  maxPerWallet: string;

  @ApiProperty({ type: String })
  receiverAddress: string;

  @ApiProperty({ type: String })
  owner: string;
}
