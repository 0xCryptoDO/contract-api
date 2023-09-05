import { SolidityType } from 'src/types';

const initialStakingWithoutTariffsConstructorTypes: Array<SolidityType> = [
  SolidityType.address,
  SolidityType.uint256,
  SolidityType.uint256,
  SolidityType.bool,
  SolidityType.uint256,
  SolidityType.uint256,
  SolidityType.uint256,
];

const initialStakingWithTariffsConstructorTypes: Array<SolidityType> = [
  SolidityType.address,
  SolidityType.uint256,
  SolidityType.uint256,
  SolidityType.bool,
  SolidityType.uint256,
  SolidityType.arrayUint256,
  SolidityType.arrayUint256,
];

export const getInitialStakingWithoutTariffsConstructorTypes: () => Array<SolidityType> =
  () => [...initialStakingWithoutTariffsConstructorTypes];

export const getInitialStakingWithTariffsConstructorTypes: () => Array<SolidityType> =
  () => [...initialStakingWithTariffsConstructorTypes];
