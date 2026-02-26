import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView } from 'expo-camera';
import * as Linking from 'expo-linking';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';
import ErrorModal from '@/ui/components/ErrorModal';
import InfoToast from '@/ui/components/InfoToast';
import PermissionDeniedState from '@/ui/components/PermissionDeniedState';
import PermissionSheet from '@/ui/components/PermissionSheet';
import Colors from '@/ui/styles/Colors';
import Spacings from '@/ui/styles/Spacings';

import { RootStackParamList } from '@/ui/navigation/types';
import { CameraPermissionsViewModel } from './CameraPermissionsViewModel';

// This screen is designed to be presented as a transparentModal on top of
// TaskDetailScreen — the dim overlay shows the task detail content behind it.

type CameraPermissionsRouteProp = RouteProp<RootStackParamList, 'CameraPermissions'>;
type CameraPermissionsNavProp = NativeStackNavigationProp<RootStackParamList, 'CameraPermissions'>;

const CameraPermissionsScreen = observer(() => {
  const navigation = useNavigation<CameraPermissionsNavProp>();
  const route = useRoute<CameraPermissionsRouteProp>();
  const cameraRef = useRef<CameraView | null>(null);
  const vm = useMemo(() => container.get<CameraPermissionsViewModel>(TYPES.CameraPermissionsViewModel), []);
  const taskId = route.params?.taskId;

  const handleCapture = async (): Promise<void> => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    if (!photo?.uri) {
      vm.userCancelled();
      navigation.goBack();
      return;
    }

    const saved = await vm.savePhoto(photo.uri);
    if (saved) {
      navigation.goBack();
    }
  };

  // Auto-reset on unmount so state is fresh next time
  useEffect(() => {
    vm.initialize(taskId);

    return () => vm.reset();
  }, [taskId, vm]);

  const isDenied = vm.state === 'denied';
  const isCancelled = vm.state === 'cancelled';
  const isSaveError = vm.state === 'save_error';

  if (isDenied) {
    // Full opaque screen — the user has permanently denied camera access
    return (
      <SafeAreaView style={[styles.screen, styles.opaque]} edges={['top', 'bottom']}>
        <PermissionDeniedState
          onPrimary={() => {
            Linking.openSettings();
          }}
          onSecondary={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  if (vm.isCameraVisible) {
    return (
      <SafeAreaView style={styles.cameraScreen} edges={['top', 'bottom']}>
        <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" />

        <View style={styles.cameraActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              vm.userCancelled();
              navigation.goBack();
            }}
            activeOpacity={0.8}
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={handleCapture} activeOpacity={0.8} disabled={vm.isSaving}>
            {vm.isSaving ? <ActivityIndicator color={Colors.mode.light.accentPrimary} /> : <View style={styles.captureInner} />}
          </TouchableOpacity>

          <View style={styles.iconButtonPlaceholder} />
        </View>
      </SafeAreaView>
    );
  }

  // Transparent modal for request / cancelled / save_error states
  return (
    <View style={styles.screen}>
      {/* Toast anchored to bottom for "cancelled" state */}
      {isCancelled ? (
        <View style={styles.toastAnchor}>
          <InfoToast message="No photo taken" />
        </View>
      ) : null}

      {/* Permission request bottom sheet */}
      <PermissionSheet
        visible={vm.isSheetVisible}
        onAllow={() => {
          void vm.allowCamera();
        }}
        onDeny={() => {
          vm.denyCamera();
          navigation.goBack();
        }}
      />

      {/* Save error modal */}
      <ErrorModal
        visible={isSaveError}
        onPrimary={() => {
          vm.retrySave();
          navigation.goBack();
        }}
        onSecondary={() => {
          vm.dismiss();
          navigation.goBack();
        }}
      />
    </View>
  );
});

export default CameraPermissionsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraPreview: {
    flex: 1,
  },
  cameraActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Spacings.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacings.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: Colors.mode.light.accentPrimary,
  },
  opaque: {
    backgroundColor: Colors.mode.light.bgPrimary,
  },
  toastAnchor: {
    position: 'absolute',
    bottom: Spacings.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
});
