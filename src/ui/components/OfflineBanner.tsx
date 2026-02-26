import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

interface OfflineBannerProps {
  message?: string;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ message = 'You are offline. Changes will sync when connection is restored.' }) => {
  return (
    <View style={styles.container}>
      <Feather name="wifi-off" size={16} color={Colors.base.warningPrimary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacings.sm,
    paddingHorizontal: Spacings.md,
    backgroundColor: Colors.base.warningSubtle,
  },
  message: {
    ...Fonts.smallBodyText,
    color: Colors.base.warningPrimary,
    flex: 1,
  },
});

export default OfflineBanner;
