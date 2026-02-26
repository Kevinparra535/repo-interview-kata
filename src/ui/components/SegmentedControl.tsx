import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import { ms } from '@/ui/styles/FontsScale';
import Shadows from '@/ui/styles/Shadows';

export type SegmentedValue = 'all' | 'pending' | 'completed';

interface SegmentedControlProps {
  value: SegmentedValue;
  onChange: (value: SegmentedValue) => void;
}

const SEGMENTS: { label: string; value: SegmentedValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const SegmentedControl: React.FC<SegmentedControlProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {SEGMENTS.map((segment) => {
        const isActive = segment.value === value;
        return (
          <TouchableOpacity
            key={segment.value}
            style={[styles.segment, isActive && styles.segmentActive]}
            onPress={() => onChange(segment.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>{segment.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mode.light.bgElevated,
    borderRadius: BorderRadius.md,
    padding: 3,
    height: 40,
    gap: 2,
  },
  segment: {
    flex: 1,
    height: '100%',
    borderRadius: BorderRadius.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: Colors.mode.light.bgSurface,
    ...Shadows.bankCard,
  },
  label: {
    ...Fonts.smallBodyText,
    fontSize: ms(13),
  },
  labelActive: {
    color: Colors.mode.light.textPrimary,
    fontFamily: Fonts.bodyTextBold.fontFamily,
  },
  labelInactive: {
    color: Colors.mode.light.textSecondary,
  },
});

export default SegmentedControl;
