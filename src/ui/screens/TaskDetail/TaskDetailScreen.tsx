import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';
import AttachmentSection from '@/ui/components/AttachmentSection';
import InfoToast from '@/ui/components/InfoToast';
import OfflineBanner from '@/ui/components/OfflineBanner';
import PrimaryButton from '@/ui/components/PrimaryButton';
import SyncStatusPanel from '@/ui/components/SyncStatusPanel';
import { NetworkStore } from '@/ui/store/NetworkStore';
import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';
import { AvatarView } from 'avatar-view';

import { type RootStackParamList } from '../../navigation/types';
import { TaskDetailViewModel } from './TaskDetailViewModel';

type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailNavProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;

const TaskDetailScreen = () => {
  const navigation = useNavigation<TaskDetailNavProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params;

  const viewModel = useMemo(() => container.get<TaskDetailViewModel>(TYPES.TaskDetailViewModel), []);
  const networkStore = useMemo(() => container.get<NetworkStore>(TYPES.NetworkStore), []);

  useFocusEffect(
    useCallback(() => {
      void viewModel.initialize(taskId);

      return () => {
        viewModel.reset();
      };
    }, [taskId, viewModel]),
  );

  if (viewModel.isTaskLoading) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewModel.isTaskError && !viewModel.task) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <View style={styles.statusCard}>
          <Text style={styles.errorText}>{viewModel.isTaskError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      {networkStore.isOffline ? <OfflineBanner /> : null}

      {/* ── Content ── */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!networkStore.isOffline && viewModel.isTaskSyncing ? <InfoToast message="Syncing task..." iconName="refresh-cw" /> : null}
        {!networkStore.isOffline && viewModel.isTaskError && viewModel.task ? (
          <InfoToast message="Sync failed. Showing local data." iconName="alert-circle" />
        ) : null}

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
            <AvatarView name={viewModel.assigneeName} size={40} />
            <View style={styles.assigneeInfo}>
              <Text style={styles.assigneeName}>{viewModel.assigneeName}</Text>
              <Text style={styles.assigneeRole}>{viewModel.assigneeRole}</Text>
            </View>
          </View>
        </View>

        {/* Attachment Section */}
        <View style={styles.card}>
          <AttachmentSection
            fileName={viewModel.task?.attachmentUri?.split('/').pop()}
            fileMeta={viewModel.task?.attachmentUri ? 'Saved on device' : undefined}
            onAttach={() => navigation.navigate('CameraPermissions', { taskId })}
            onReplace={() => navigation.navigate('CameraPermissions', { taskId })}
          />
        </View>

        {/* Sync Status Panel */}
        <SyncStatusPanel
          status={networkStore.isOffline ? 'offline' : viewModel.isTaskSyncing ? 'syncing' : 'online'}
          lastSync="2 min ago"
          pendingChanges={viewModel.isTaskSyncing ? 1 : 0}
        />
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={styles.bottomCta}>
        <PrimaryButton label="Attach photo" onPress={() => navigation.navigate('CameraPermissions', { taskId })} />
        <Text style={styles.helperText}>Will upload when back online</Text>
      </View>
    </SafeAreaView>
  );
};

export default observer(TaskDetailScreen);

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
  statusCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacings.lg,
  },
  statusText: {
    ...Fonts.bodyText,
    color: Colors.mode.light.textSecondary,
  },
  errorText: {
    ...Fonts.bodyText,
    color: Colors.base.dangerPrimary,
    textAlign: 'center',
  },
});
