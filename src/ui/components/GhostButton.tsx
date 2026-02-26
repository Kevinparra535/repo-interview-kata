import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

interface GhostButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
}

const GhostButton: React.FC<GhostButtonProps> = ({ label, loading = false, disabled, style, ...rest }) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity activeOpacity={0.7} disabled={isDisabled} style={[styles.button, isDisabled && styles.disabled, style]} {...rest}>
      {loading ? <ActivityIndicator color={Colors.mode.light.accentPrimary} /> : <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    paddingHorizontal: Spacings.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.accentPrimary,
  },
});

export default GhostButton;
