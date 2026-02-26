import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Shadows from '@/ui/styles/Shadows';
import Spacings from '@/ui/styles/Spacings';

interface InfoToastProps {
  message: string;
  iconName?: React.ComponentProps<typeof Feather>['name'];
}

const InfoToast: React.FC<InfoToastProps> = ({ message, iconName = 'x' }) => (
  <View style={styles.toast}>
    <Feather name={iconName} size={18} color={Colors.semantic.text.primaryLight} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

export default InfoToast;

const styles = StyleSheet.create({
  toast: {
    paddingHorizontal: Spacings.md,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    gap: 10,
    backgroundColor: Colors.mode.dark.bgElevated,
    borderRadius: BorderRadius.md,
    ...Shadows.cardShadowStrong,
  },
  text: {
    ...Fonts.smallBodyText,
    color: Colors.semantic.text.primaryLight,
  },
});
