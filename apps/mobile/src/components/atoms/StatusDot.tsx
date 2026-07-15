import { View, StyleSheet } from 'react-native';
import { colors } from '../../design/tokens';

type Props = { status: 'online' | 'away' | 'offline'; size?: number };

const DOT_COLOR: Record<Props['status'], string> = {
  online:  colors.online,
  away:    colors.away,
  offline: colors.textMuted,
};

export function StatusDot({ status, size = 10 }: Props) {
  return (
    <View
      style={[
        styles.dot,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: DOT_COLOR[status] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: { borderWidth: 2, borderColor: colors.bg },
});
