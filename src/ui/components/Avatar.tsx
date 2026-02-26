import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Fonts from '@/ui/styles/Fonts';
import { ms } from '@/ui/styles/FontsScale';

const AVATAR_COLORS = [
  Colors.mode.light.accentPrimary,
  Colors.base.avatarPurple,
  Colors.base.avatarBlue,
  Colors.base.dangerPrimary,
  Colors.base.warningPrimary,
  Colors.base.successPrimary,
];

function getAvatarColor(seed: string | number): string {
  const n = typeof seed === 'number' ? seed : seed.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40 }) => {
  const bg = getAvatarColor(name);
  const fontSize = ms(size * 0.35);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: BorderRadius.pill, backgroundColor: bg }]}>
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    ...Fonts.bodyTextBold,
    color: '#FFFFFF',
  },
});

export default Avatar;
