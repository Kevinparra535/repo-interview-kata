import 'react-native-gesture-handler';
import 'reflect-metadata';

import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';
import { AppNavigator } from '@/ui/navigation/AppNavigator';
import { SyncCoordinator } from '@/ui/store/SyncCoordinator';

export default function App() {
  useEffect(() => {
    const syncCoordinator = container.get<SyncCoordinator>(TYPES.SyncCoordinator);
    syncCoordinator.start();

    return () => {
      syncCoordinator.stop();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
