import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

import GhostButton from './GhostButton';
import PrimaryButton from './PrimaryButton';

interface PermissionDeniedStateProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
}

const PermissionDeniedState: React.FC<PermissionDeniedStateProps> = ({
  title = 'Camera access is disabled',
  description = 'You can enable it anytime in your device settings. We only use the camera to attach photos to tasks.',
  primaryLabel = 'Open Settings',
  secondaryLabel = 'Continue without camera',
  onPrimary,
  onSecondary,
}) => (
  <View style={styles.container}>
    <View style={styles.iconCircle}>
      <Feather name="camera-off" size={40} color={Colors.mode.light.textTertiary} />
    </View>

    <View style={styles.textBlock}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>

    <PrimaryButton label={primaryLabel} onPress={onPrimary} style={styles.primaryBtn} />
    {onSecondary ? <GhostButton label={secondaryLabel ?? 'Skip'} onPress={onSecondary} style={styles.ghostBtn} /> : null}
  </View>
);

export default PermissionDeniedState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacings.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacings.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    gap: Spacings.sm,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...Fonts.callToActions,
    color: Colors.mode.light.textPrimary,
    textAlign: 'center',
  },
  desc: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  primaryBtn: {
    width: '100%',
  },
  ghostBtn: {
    width: '100%',
  },
});
