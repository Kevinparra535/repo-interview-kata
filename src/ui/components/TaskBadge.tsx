import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

export type TaskBadgeVariant = 'pending' | 'completed' | 'error';

interface TaskBadgeProps {
  variant: TaskBadgeVariant;
}

type BadgeConfig = {
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
};

const BADGE_CONFIG: Record<TaskBadgeVariant, BadgeConfig> = {
  pending: {
    label: 'Pending',
    dotColor: Colors.base.warningPrimary,
    textColor: Colors.base.warningPrimary,
    bgColor: Colors.base.warningSubtle,
  },
  completed: {
    label: 'Completed',
    dotColor: Colors.base.successPrimary,
    textColor: Colors.base.successPrimary,
    bgColor: Colors.base.successSubtle,
  },
  error: {
    label: 'Error',
    dotColor: Colors.base.dangerPrimary,
    textColor: Colors.base.dangerPrimary,
    bgColor: Colors.base.dangerDim,
  },
};

const TaskBadge: React.FC<TaskBadgeProps> = ({ variant }) => {
  const config = BADGE_CONFIG[variant];

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }]}>
      <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
      <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacings.sm - 2,
    paddingHorizontal: Spacings.md - 4,
    borderRadius: BorderRadius.pill,
    gap: Spacings.sm - 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.pill,
  },
  label: {
    ...Fonts.links,
  },
});

export default TaskBadge;
