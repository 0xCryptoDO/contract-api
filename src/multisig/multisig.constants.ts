import { SolidityType } from 'src/types';

const initialConstructorTypes: Array<SolidityType> = [
  SolidityType.arrayAddress,
  SolidityType.arrayUint256,
  SolidityType.uint256,
  SolidityType.address,
];

export const getInitialMultisigConstructorTypes: () => Array<SolidityType> =
  () => [...initialConstructorTypes];
