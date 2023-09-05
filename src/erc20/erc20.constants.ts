import { SolidityType } from 'src/types';

const initialConstructorTypes: Array<SolidityType> = [
  SolidityType.address,
  SolidityType.string,
  SolidityType.string,
  SolidityType.uint8,
  SolidityType.uint256,
];

export const getInitialERC20ConstructorTypes: () => Array<SolidityType> =
  () => [...initialConstructorTypes];
