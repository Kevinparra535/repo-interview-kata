import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Shadows from '@/ui/styles/Shadows';
import Spacings from '@/ui/styles/Spacings';

import GhostButton from './GhostButton';
import PrimaryButton from './PrimaryButton';

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary: () => void;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  iconColor?: string;
  iconBg?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  visible,
  title = "Couldn't save photo locally",
  description = "There wasn't enough storage to save the photo. Free up some space and try again.",
  primaryLabel = 'Try again',
  secondaryLabel = 'Dismiss',
  onPrimary,
  onSecondary,
  iconName = 'hard-drive',
  iconColor = Colors.base.dangerPrimary,
  iconBg = Colors.base.dangerDim,
}) => (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onSecondary}>
    <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onSecondary} />
    <View style={styles.centeredWrapper} pointerEvents="box-none">
      <View style={styles.modal}>
        <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
          <Feather name={iconName} size={28} color={iconColor} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{description}</Text>
        </View>

        <View style={styles.btnGroup}>
          <PrimaryButton label={primaryLabel} onPress={onPrimary} style={styles.actionBtn} />
          <GhostButton label={secondaryLabel} onPress={onSecondary} style={styles.actionBtn} />
        </View>
      </View>
    </View>
  </Modal>
);

export default ErrorModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.base.overlayDim,
  },
  centeredWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    padding: Spacings.lg,
    width: 330,
    alignItems: 'center',
    gap: Spacings.lg,
    backgroundColor: Colors.mode.light.bgPrimary,
    borderRadius: BorderRadius.lg,
    ...Shadows.formCard,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    gap: Spacings.sm,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...Fonts.callToActions,
    color: Colors.mode.light.textPrimary,
    textAlign: 'center',
  },
  desc: {
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
