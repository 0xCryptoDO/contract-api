import { SolidityType } from 'src/types';

const initialConstructorTypes: Array<SolidityType> = [
  SolidityType.string,
  SolidityType.string,
  SolidityType.uint8,
  SolidityType.arrayAddress,
  SolidityType.arrayUint256,
  SolidityType.string,
];

export const getInitialDaoConstructorTypes: () => Array<SolidityType> = () => [
  ...initialConstructorTypes,
];
