import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { container } from '@/config/di';
import { TYPES } from '@/config/types';
import ErrorModal from '@/ui/components/ErrorModal';
import InfoToast from '@/ui/components/InfoToast';
import PermissionDeniedState from '@/ui/components/PermissionDeniedState';
import PermissionSheet from '@/ui/components/PermissionSheet';
import Colors from '@/ui/styles/Colors';
import Spacings from '@/ui/styles/Spacings';

import { CameraPermissionsViewModel } from './CameraPermissionsViewModel';

// This screen is designed to be presented as a transparentModal on top of
// TaskDetailScreen — the dim overlay shows the task detail content behind it.

const CameraPermissionsScreen = observer(() => {
  const vm = useMemo(() => container.get<CameraPermissionsViewModel>(TYPES.CameraPermissionsViewModel), []);

  // Auto-reset on unmount so state is fresh next time
  useEffect(() => () => vm.reset(), [vm]);

  const isDenied = vm.state === 'denied';
  const isCancelled = vm.state === 'cancelled';
  const isSaveError = vm.state === 'save_error';

  if (isDenied) {
    // Full opaque screen — the user has permanently denied camera access
    return (
      <SafeAreaView style={[styles.screen, styles.opaque]} edges={['top', 'bottom']}>
        <PermissionDeniedState
          onPrimary={() => {
            /* Linking.openSettings() */
          }}
          onSecondary={() => vm.dismiss()}
        />
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
      <PermissionSheet visible={vm.isSheetVisible} onAllow={() => vm.allowCamera()} onDeny={() => vm.denyCamera()} />

      {/* Save error modal */}
      <ErrorModal visible={isSaveError} onPrimary={() => vm.retrySave()} onSecondary={() => vm.dismiss()} />
    </View>
  );
});

export default CameraPermissionsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
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
