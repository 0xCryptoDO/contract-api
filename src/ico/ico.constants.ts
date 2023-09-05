import { SolidityType } from 'src/types';

const initialConstructorTypes: Array<SolidityType> = [
  SolidityType.address,
  SolidityType.uint256,
  SolidityType.uint256,
  SolidityType.uint256,
];

export const getInitialICOConstructorTypes: () => Array<SolidityType> = () => [
  ...initialConstructorTypes,
];
