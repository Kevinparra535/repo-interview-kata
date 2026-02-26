import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import Spacings from '@/ui/styles/Spacings';

export type SyncStatusType = 'online' | 'offline' | 'syncing';

interface SyncStatusPanelProps {
  status?: SyncStatusType;
  lastSync?: string;
  pendingChanges?: number;
  title?: string;
}

const STATUS_CONFIG: Record<SyncStatusType, { label: string; color: string }> = {
  online: { label: 'Online', color: Colors.base.successPrimary },
  offline: { label: 'Offline', color: Colors.base.warningPrimary },
  syncing: { label: 'Syncing…', color: Colors.mode.light.accentPrimary },
};

const SyncStatusPanel: React.FC<SyncStatusPanelProps> = ({ status = 'online', lastSync = '—', pendingChanges = 0, title = 'Sync Status' }) => {
  const cfg = STATUS_CONFIG[status];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.indicator}>
          <View style={[styles.dot, { backgroundColor: cfg.color }]} />
          <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoBlock}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last sync</Text>
          <Text style={styles.infoValue}>{lastSync}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pending changes</Text>
          <Text style={styles.infoValue}>{pendingChanges}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacings.md,
    backgroundColor: Colors.mode.light.bgSurface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.mode.light.borderSubtle,
    gap: Spacings.md - 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Fonts.bodyTextBold,
    color: Colors.mode.light.textPrimary,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.sm - 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.pill,
  },
  statusLabel: {
    ...Fonts.smallBodyText,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.mode.light.borderSubtle,
  },
  infoBlock: {
    gap: Spacings.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textSecondary,
  },
  infoValue: {
    ...Fonts.smallBodyText,
    color: Colors.mode.light.textPrimary,
    fontFamily: Fonts.bodyTextBold.fontFamily,
  },
});

export default SyncStatusPanel;
