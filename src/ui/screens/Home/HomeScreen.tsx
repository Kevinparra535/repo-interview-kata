import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';

import { HomeViewModel } from './HomeViewModel';

const HomeScreen = observer(() => {
  const viewModel = useMemo(() => container.get<HomeViewModel>(TYPES.HomeViewModel), []);

  useEffect(() => {
    viewModel.initialize();

    return () => {
      viewModel.reset();
    };
  }, [viewModel]);

  if (viewModel.isTasksLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (viewModel.isTasksError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{viewModel.isTasksError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks</Text>

      <FlatList
        data={viewModel.isTasksResponse ?? []}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTodo}>{item.todo}</Text>
            <Text style={styles.taskMeta}>userId: {item.userId}</Text>
            <Text style={styles.taskMeta}>completed: {item.completed ? 'true' : 'false'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.subtitle}>Sin tareas disponibles</Text>}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  separator: {
    height: 12,
  },
  taskCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  taskTodo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  taskMeta: {
    fontSize: 13,
    color: '#666',
  },
  error: {
    color: '#d33',
    textAlign: 'center',
  },
});

export default HomeScreen;
