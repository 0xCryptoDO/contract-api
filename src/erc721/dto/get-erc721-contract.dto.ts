import { IERC721Contract } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { GetBaseContractResDto } from 'src/contract/dto/base-contract/get-base-contract.dto';

export class GetERC721ContractResDto
  extends GetBaseContractResDto
  implements IERC721Contract
{
  @ApiProperty()
  contractName: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  totalSupply: string;

  @ApiProperty()
  tokenPerTx: number;

  @ApiProperty()
  tokenPerWallet: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  timeForReveal: number;

  @ApiProperty()
  founder: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  uri: string;
}
