import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { colors } from '../../design/tokens';

type Props = { value: boolean; onValueChange: (v: boolean) => void };

const TRACK_W  = 40;
const TRACK_H  = 24;
const THUMB    = 16;
const PADDING  = 4;
const TRAVEL   = TRACK_W - THUMB - PADDING * 2;

export function HToggle({ value, onValueChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue:         value ? 1 : 0,
      useNativeDriver: true,
      damping:         18,
      stiffness:       200,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [PADDING, PADDING + TRAVEL] });
  const trackBg    = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.card, colors.accent] });
  const thumbBg    = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.textMuted, colors.bg] });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }], backgroundColor: thumbBg }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width:        TRACK_W,
    height:       TRACK_H,
    borderRadius: TRACK_H / 2,
    borderWidth:  1,
    borderColor:  colors.border,
    justifyContent: 'center',
  },
  thumb: {
    position:     'absolute',
    width:        THUMB,
    height:       THUMB,
    borderRadius: THUMB / 2,
  },
});
