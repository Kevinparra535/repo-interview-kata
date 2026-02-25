import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

import SecondaryButton from './SecondaryButton';

interface AttachmentBlockProps {
  fileName: string;
  fileMeta?: string;
  onReplace?: () => void;
}

const AttachmentBlock: React.FC<AttachmentBlockProps> = ({ fileName, fileMeta, onReplace }) => (
  <View style={styles.block}>
    <View style={styles.thumbnail}>
      <Feather name="image" size={24} color={Colors.mode.light.textTertiary} />
    </View>
    <View style={styles.blockInfo}>
      <Text style={styles.fileName} numberOfLines={1}>
        {fileName}
      </Text>
      {fileMeta ? <Text style={styles.fileMeta}>{fileMeta}</Text> : null}
    </View>
    {onReplace ? (
      <TouchableOpacity style={styles.replaceBtn} onPress={onReplace} activeOpacity={0.7}>
        <Feather name="refresh-cw" size={16} color={Colors.mode.light.textSecondary} />
      </TouchableOpacity>
    ) : null}
  </View>
);

interface AttachmentSectionProps {
  fileName?: string;
  fileMeta?: string;
  onAttach?: () => void;
  onReplace?: () => void;
}

const AttachmentSection: React.FC<AttachmentSectionProps> = ({ fileName, fileMeta, onAttach, onReplace }) => (
  <View style={styles.wrapper}>
    <Text style={styles.sectionLabel}>ATTACHMENTS</Text>

    {fileName ? (
      <AttachmentBlock fileName={fileName} fileMeta={fileMeta} onReplace={onReplace} />
    ) : (
      <View style={styles.placeholder}>
        <Feather name="image" size={32} color={Colors.mode.light.textTertiary} />
        <Text style={styles.placeholderText}>No photo attached</Text>
      </View>
    )}

    <SecondaryButton label="Attach photo" onPress={onAttach} style={styles.attachBtn} />
  </View>
);

export { AttachmentBlock };
export default AttachmentSection;

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacings.md - 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: Colors.mode.light.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  placeholder: {
    height: 120,
    backgroundColor: Colors.mode.light.bgElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.mode.light.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacings.sm,
  },
  placeholderText: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textTertiary,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.md - 4,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.mode.light.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockInfo: {
    flex: 1,
    gap: 4,
  },
  fileName: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.textPrimary,
  },
  fileMeta: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textTertiary,
  },
  replaceBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachBtn: {
    width: '100%',
  },
});
