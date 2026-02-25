import { useRoute, type RouteProp } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';
import AttachmentSection from '@/ui/components/AttachmentSection';
import Avatar from '@/ui/components/Avatar';
import PrimaryButton from '@/ui/components/PrimaryButton';
import SyncStatusPanel from '@/ui/components/SyncStatusPanel';
import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

import { type RootStackParamList } from '../../navigation/types';
import { TaskDetailViewModel } from './TaskDetailViewModel';

type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen = observer(() => {
  const route = useRoute<TaskDetailRouteProp>();
  const { task } = route.params;

  const viewModel = useMemo(() => container.get<TaskDetailViewModel>(TYPES.TaskDetailViewModel), []);

  useEffect(() => {
    viewModel.setTask(task);
  }, [task, viewModel]);

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      {/* ── Content ── */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.taskTitle}>{viewModel.task?.todo ?? '—'}</Text>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Completed</Text>
            <Switch
              value={viewModel.isCompleted}
              onValueChange={() => viewModel.toggleCompleted()}
              trackColor={{
                false: Colors.mode.light.borderSubtle,
                true: Colors.mode.light.accentPrimary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.metaBlock}>
            <Text style={styles.metaText}>Task ID: {viewModel.formattedId}</Text>
            <Text style={styles.metaText}>Last updated: 2m ago</Text>
          </View>
        </View>

        {/* Assigned Section */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ASSIGNED TO</Text>
          <View style={styles.assigneeRow}>
            <Avatar name={viewModel.assigneeName} size={40} />
            <View style={styles.assigneeInfo}>
              <Text style={styles.assigneeName}>{viewModel.assigneeName}</Text>
              <Text style={styles.assigneeRole}>{viewModel.assigneeRole}</Text>
            </View>
          </View>
        </View>

        {/* Attachment Section */}
        <View style={styles.card}>
          <AttachmentSection
            onAttach={() => {
              /* handle attach */
            }}
          />
        </View>

        {/* Sync Status Panel */}
        <SyncStatusPanel status="online" lastSync="2 min ago" pendingChanges={0} />
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={styles.bottomCta}>
        <PrimaryButton
          label="Attach photo"
          onPress={() => {
            /* handle attach */
          }}
        />
        <Text style={styles.helperText}>Will upload when back online</Text>
      </View>
    </SafeAreaView>
  );
});

export default TaskDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.mode.light.bgPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacings.sm,
    paddingHorizontal: Spacings.md,
    paddingBottom: Spacings.md,
    gap: Spacings.md,
  },
  card: {
    backgroundColor: Colors.mode.light.bgSurface,
    borderRadius: BorderRadius.lg,
    padding: 20,
    gap: Spacings.md,
    borderWidth: 1,
    borderColor: Colors.mode.light.borderSubtle,
  },
  taskTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.mode.light.textPrimary,
    lineHeight: 28,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.mode.light.borderSubtle,
  },
  metaBlock: {
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.mode.light.textTertiary,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: Colors.mode.light.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.md - 4,
  },
  assigneeInfo: {
    gap: 2,
  },
  assigneeName: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.textPrimary,
  },
  assigneeRole: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textSecondary,
  },
  bottomCta: {
    backgroundColor: Colors.mode.light.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: Colors.mode.light.borderSubtle,
    paddingHorizontal: Spacings.md,
    paddingTop: Spacings.md - 4,
    paddingBottom: 24,
    gap: Spacings.sm,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.mode.light.textTertiary,
    textAlign: 'center',
  },
});
