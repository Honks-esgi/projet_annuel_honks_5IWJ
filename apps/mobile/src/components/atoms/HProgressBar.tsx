import { StyleSheet, View } from 'react-native';
import { colors } from '../../design/tokens';

type Props = { step: 1 | 2 | 3 };

const FILL = { 1: '33%', 2: '67%', 3: '100%' } as const;

export function HProgressBar({ step }: Props) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: FILL[step] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height:          4,
    width:           '100%',
    backgroundColor: colors.surface,
  },
  fill: {
    height:          4,
    backgroundColor: colors.accent,
  },
});
