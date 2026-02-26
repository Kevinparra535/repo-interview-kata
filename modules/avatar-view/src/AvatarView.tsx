import { requireNativeView } from 'expo';
import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface AvatarViewProps {
  /** Full name used to derive initials and deterministic background color. */
  name: string;
  /** Diameter in dp/pt. Defaults to 40. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const NativeAvatarView: React.ComponentType<AvatarViewProps> = requireNativeView('AvatarView');

const AvatarView: React.FC<AvatarViewProps> = ({ name, size = 40, style }) => {
  return <NativeAvatarView name={name} size={size} style={[{ width: size, height: size }, style]} />;
};

export default AvatarView;
