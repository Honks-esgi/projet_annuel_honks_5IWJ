import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../../design/tokens';
import { HText } from './HText';

export type UserStatus = 'online' | 'away' | 'dnd' | 'offline';

const STATUS_CONFIG: Record<UserStatus, { dot: string; activeText: string; activeBg: string; activeBorder: string; label: string }> = {
  online:  { dot: colors.online,  activeText: colors.online,  activeBg: colors.onlineSubtle, activeBorder: colors.online,  label: 'EN LIGNE' },
  away:    { dot: colors.away,    activeText: colors.away,    activeBg: 'rgba(251,146,60,0.13)', activeBorder: colors.away,    label: 'ABSENT' },
  dnd:     { dot: colors.danger,  activeText: colors.danger,  activeBg: colors.dangerSubtle, activeBorder: colors.danger,  label: 'NE PAS DÉRANGER' },
  offline: { dot: colors.textMuted, activeText: colors.textMuted, activeBg: colors.surface, activeBorder: colors.border, label: 'HORS LIGNE' },
};

type Props = { status: UserStatus; active: boolean; onPress: () => void };

export function HStatusChip({ status, active, onPress }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active
          ? { backgroundColor: cfg.activeBg, borderColor: cfg.activeBorder }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <HText
        variant="label"
        color={active ? cfg.activeText : colors.textMuted}
        style={styles.label}
      >
        {cfg.label}
      </HText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    paddingHorizontal: 17,
    paddingVertical:   9,
    borderRadius:    9999,
    borderWidth:     1,
  },
  dot:   { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12 },
});
