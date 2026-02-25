import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

interface TopBarProps {
  title: string;
  onRefresh?: () => void;
  onFilter?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, onRefresh, onFilter }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        {onRefresh ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRefresh} activeOpacity={0.7}>
            <Feather name="refresh-cw" size={18} color={Colors.mode.light.textSecondary} />
          </TouchableOpacity>
        ) : null}
        {onFilter ? (
          <TouchableOpacity style={styles.iconButton} onPress={onFilter} activeOpacity={0.7}>
            <Feather name="sliders" size={18} color={Colors.mode.light.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacings.md,
    backgroundColor: Colors.mode.light.bgPrimary,
  },
  title: {
    ...Fonts.header3,
    color: Colors.mode.light.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.md - 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TopBar;
