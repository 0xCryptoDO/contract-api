import { SolidityType } from 'src/types';

const initialVestingLockerConstructorTypes: Array<SolidityType> = [
  SolidityType.address,
  SolidityType.arrayAddress,
  SolidityType.arrayUint256,
  SolidityType.uint256,
];

const initialVestingConstructorTypes: Array<SolidityType> = [
  SolidityType.address,
  SolidityType.arrayAddress,
  SolidityType.arrayUint256,
  SolidityType.arrayUint256,
  SolidityType.arrayUint256,
];

export const getInitialVestingConstructorTypes: () => Array<SolidityType> =
  () => [...initialVestingConstructorTypes];

export const getInitialVestingLockerConstructorTypes: () => Array<SolidityType> =
  () => [...initialVestingLockerConstructorTypes];
