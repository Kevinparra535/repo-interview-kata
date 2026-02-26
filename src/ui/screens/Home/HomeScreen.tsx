import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';
import EmptyState from '@/ui/components/EmptyState';
import InfoToast from '@/ui/components/InfoToast';
import OfflineBanner from '@/ui/components/OfflineBanner';
import SegmentedControl from '@/ui/components/SegmentedControl';
import SkeletonRow from '@/ui/components/SkeletonRow';
import TaskRow from '@/ui/components/TaskRow';
import TopBar from '@/ui/components/TopBar';
import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

import { type RootStackParamList } from '../../navigation/types';
import { HomeViewModel, TaskFilter } from './HomeViewModel';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SKELETON_COUNT = 6;

const HomeScreen = observer(() => {
  const navigation = useNavigation<HomeNavProp>();
  const viewModel = useMemo(() => container.get<HomeViewModel>(TYPES.HomeViewModel), []);

  const handleRefresh = useCallback(() => {
    viewModel.refresh();
  }, [viewModel]);

  const handleFilterChange = useCallback(
    (filter: TaskFilter) => {
      viewModel.setFilter(filter);
    },
    [viewModel],
  );

  const renderTask = useCallback(
    ({ item }: { item: { id: number; todo: string; completed: boolean; userId: number } }) => (
      <TaskRow
        title={item.todo}
        meta={`User ${item.userId}`}
        completed={item.completed}
        onToggle={() => viewModel.toggleTaskStatus(item)}
        onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      />
    ),
    [navigation, viewModel],
  );

  const renderEmpty = useCallback(() => <EmptyState onRefresh={handleRefresh} />, [handleRefresh]);

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderBody = () => {
    const hasData = (viewModel.isTasksResponse?.length ?? 0) > 0;

    if (viewModel.isTasksLoading) {
      return (
        <View style={styles.skeletonList}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      );
    }

    if (viewModel.isTasksError && !hasData) {
      return (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDesc}>{viewModel.isTasksError}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={viewModel.filteredTasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTask}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={viewModel.isTasksRefreshing} onRefresh={handleRefresh} tintColor={Colors.mode.light.accentPrimary} />
        }
      />
    );
  };

  useEffect(() => {
    viewModel.initialize();
    return () => {
      viewModel.reset();
    };
  }, [viewModel]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TopBar title="Tasks" onRefresh={handleRefresh} />
      {viewModel.isOffline ? <OfflineBanner /> : null}

      <View style={styles.content}>
        {!viewModel.isOffline && viewModel.isTasksRefreshing ? <InfoToast message="Syncing tasks..." iconName="refresh-cw" /> : null}
        {!viewModel.isOffline && viewModel.isTasksError && (viewModel.isTasksResponse?.length ?? 0) > 0 ? (
          <InfoToast message="Sync failed. Showing local data." iconName="alert-circle" />
        ) : null}
        <SegmentedControl value={viewModel.activeFilter} onChange={handleFilterChange} />
        {renderBody()}
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.mode.light.bgPrimary,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.mode.light.bgElevated,
    paddingTop: Spacings.md - 4,
    paddingHorizontal: Spacings.md,
    paddingBottom: Spacings.md,
    gap: Spacings.md - 4,
  },
  listContent: {
    paddingBottom: Spacings.lg,
    gap: Spacings.sm - 2,
  },
  skeletonList: {
    gap: Spacings.sm - 2,
  },
  separator: {
    height: Spacings.sm - 2,
  },
  errorCard: {
    backgroundColor: Colors.mode.light.bgSurface,
    borderRadius: BorderRadius.md,
    padding: Spacings.md,
    gap: Spacings.sm,
    borderWidth: 1,
    borderColor: Colors.base.dangerDimBorder,
  },
  errorTitle: {
    ...Fonts.bodyTextBold,
    color: Colors.base.dangerPrimary,
  },
  errorDesc: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textSecondary,
  },
});

export default HomeScreen;
