import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';
import { hexToRgba } from '@/ui/utils/colorUtils';

import GhostButton from './GhostButton';
import PrimaryButton from './PrimaryButton';

interface PermissionSheetProps {
  visible: boolean;
  title?: string;
  description?: string;
  allowLabel?: string;
  denyLabel?: string;
  onAllow: () => void;
  onDeny: () => void;
}

const PermissionSheet: React.FC<PermissionSheetProps> = ({
  visible,
  title = 'Allow Camera Access',
  description = 'To attach a photo to a task, we need camera access. Your photos stay on-device until you sync.',
  allowLabel = 'Allow',
  denyLabel = 'Not now',
  onAllow,
  onDeny,
}) => (
  <Modal transparent animationType="slide" visible={visible} onRequestClose={onDeny}>
    <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDeny} />
    <View style={styles.sheet}>
      <View style={styles.handle} />

      <View style={styles.iconWrap}>
        <Feather name="camera" size={32} color={Colors.mode.light.accentPrimary} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.shTitle}>{title}</Text>
        <Text style={styles.shDesc}>{description}</Text>
      </View>

      <View style={styles.btnGroup}>
        <PrimaryButton label={allowLabel} onPress={onAllow} style={styles.actionBtn} />
        <GhostButton label={denyLabel} onPress={onDeny} style={styles.actionBtn} />
      </View>
    </View>
  </Modal>
);

export default PermissionSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: hexToRgba('#000000', 0.4),
  },
  sheet: {
    paddingTop: 12,
    paddingHorizontal: Spacings.lg,
    paddingBottom: Spacings.xl,
    backgroundColor: Colors.mode.light.bgPrimary,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    gap: Spacings.lg,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.borderSubtle,
    marginBottom: Spacings.sm - 4,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.accentPrimarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    gap: Spacings.sm,
    alignItems: 'center',
    width: '100%',
  },
  shTitle: {
    ...Fonts.callToActions,
    color: Colors.mode.light.textPrimary,
    textAlign: 'center',
  },
  shDesc: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  btnGroup: {
    gap: 10,
    width: '100%',
  },
  actionBtn: {
    width: '100%',
  },
});
