import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ label, loading = false, disabled, style, ...rest }) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity activeOpacity={0.8} disabled={isDisabled} style={[styles.button, isDisabled && styles.disabled, style]} {...rest}>
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    paddingHorizontal: Spacings.lg,
    backgroundColor: Colors.mode.light.accentPrimary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...Fonts.bodyTextBold,
    color: '#FFFFFF',
  },
});

export default PrimaryButton;
