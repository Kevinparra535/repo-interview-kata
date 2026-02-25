import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { container } from '@src/config/di';
import { TYPES } from '@src/config/types';

import { HomeViewModel } from './HomeViewModel';

const HomeScreen = observer(() => {
  const viewModel = useMemo(
    () => container.get<HomeViewModel>(TYPES.HomeViewModel),
    [],
  );

  useEffect(() => {
    viewModel.initialize();

    return () => {
      viewModel.reset();
    };
  }, [viewModel]);

  if (viewModel.isHomeLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (viewModel.isHomeError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{viewModel.isHomeError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>{viewModel.isHomeResponse ?? 'Sin datos'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#d33',
    textAlign: 'center',
  },
});

export default HomeScreen;
