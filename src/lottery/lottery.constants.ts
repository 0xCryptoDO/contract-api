import { SolidityType } from 'src/types';

const initialConstructorTypes: Array<SolidityType> = [
  SolidityType.uint8,
  SolidityType.uint,
  SolidityType.uint32,
  SolidityType.uint,
  SolidityType.uint,
  SolidityType.arrayUint8,
  SolidityType.arrayUint8,
];
export const getInitialLotteryConstructorTypes: () => Array<SolidityType> =
  () => [...initialConstructorTypes];

export const lotteryCompilerVersion = 'v0.8.16+commit.07a7930e';

export const devFee = 5;

export const devAddress =
  process.env.NODE_ENV === 'production'
    ? '0x1C8B6988Eb92E03e6796356e8D63d0877Cd30c21'
    : '0xfC469C1569585F131Ad21724796dbD56687524D2';
export const refFee = 5;
