import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

// Wrap scale helpers with Math.round so Hermes never receives a float
// for style props like fontSize, borderRadius, width, height, etc.
export const ms = (size: number, factor?: number): number => Math.round(moderateScale(size, factor ?? 0.5));
export const s = (size: number): number => Math.round(scale(size));
export const vs = (size: number): number => Math.round(verticalScale(size));
