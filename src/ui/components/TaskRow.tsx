import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

import TaskBadge from './TaskBadge';

interface TaskRowProps {
  title: string;
  meta?: string;
  completed: boolean;
  onPress?: () => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ title, meta, completed, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.container}>
      <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
        {completed ? <Feather name="check" size={12} color={Colors.base.bgPrimary} /> : null}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, completed && styles.titleCompleted]} numberOfLines={2}>
          {title}
        </Text>
        {meta ? (
          <Text style={styles.meta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>

      <TaskBadge variant={completed ? 'completed' : 'pending'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mode.light.bgSurface,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacings.md,
    gap: Spacings.md - 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    borderColor: Colors.mode.light.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.mode.light.accentPrimary,
    borderColor: Colors.mode.light.accentPrimary,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.textPrimary,
  },
  titleCompleted: {
    color: Colors.mode.light.textTertiary,
  },
  meta: {
    ...Fonts.links,
    color: Colors.mode.light.textTertiary,
  },
});

export default TaskRow;
