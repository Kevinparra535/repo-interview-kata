import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import BorderRadius from '@/ui/styles/BorderRadius';
import Colors from '@/ui/styles/Colors';
import Spacings from '@/ui/styles/Spacings';

const SkeletonRow: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.checkbox} />
      <View style={styles.content}>
        <View style={styles.line1} />
        <View style={styles.line2} />
      </View>
      <View style={styles.badge} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.mode.light.bgSurface,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: Spacings.md,
    gap: Spacings.md - 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.mode.light.bgElevated,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  line1: {
    height: 14,
    width: '65%',
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.mode.light.bgElevated,
  },
  line2: {
    height: 10,
    width: '40%',
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.mode.light.bgElevated,
  },
  badge: {
    height: 24,
    width: 64,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.mode.light.bgElevated,
  },
});

export default SkeletonRow;
