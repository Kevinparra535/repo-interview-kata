import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

interface SecondaryButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, loading = false, disabled, style, ...rest }) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity activeOpacity={0.8} disabled={isDisabled} style={[styles.button, isDisabled && styles.disabled, style]} {...rest}>
      {loading ? <ActivityIndicator color={Colors.mode.light.textPrimary} /> : <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 44,
    paddingHorizontal: Spacings.lg,
    backgroundColor: Colors.mode.light.bgElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.mode.light.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.textPrimary,
  },
});

export default SecondaryButton;
