import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

interface EmptyStateProps {
  onRefresh?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
  return (
    <View style={styles.container}>
      <Feather name="inbox" size={48} color={Colors.mode.light.textTertiary} />
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.description}>Pull to refresh or create your first task</Text>
      {onRefresh ? (
        <TouchableOpacity style={styles.button} onPress={onRefresh} activeOpacity={0.7}>
          <Text style={styles.buttonLabel}>Pull to refresh</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.mode.light.bgSurface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacings.xxl + 8,
    paddingHorizontal: Spacings.lg,
    gap: Spacings.md,
  },
  title: {
    ...Fonts.header5,
    color: Colors.mode.light.textPrimary,
  },
  description: {
    ...Fonts.bodyText,
    color: Colors.mode.light.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacings.sm,
    paddingVertical: Spacings.sm,
    paddingHorizontal: Spacings.md + 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.mode.light.accentPrimary,
  },
  buttonLabel: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.accentPrimary,
  },
});

export default EmptyState;
