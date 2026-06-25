import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../design/tokens';
import { HText } from './HText';

type SelectedVariant = { variant: 'selected'; username: string };
type StatusVariant   = { variant: 'status'; username: string; responded: boolean };
type Props = SelectedVariant | StatusVariant;

export function HRecipientTag(props: Props) {
  if (props.variant === 'selected') {
    return (
      <View style={styles.selected}>
        <HText variant="label" color={colors.textOnAccent} style={styles.selectedText}>
          @{props.username}
        </HText>
      </View>
    );
  }

  const dotColor = props.responded ? colors.online : colors.textMuted;
  return (
    <View style={styles.status}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <HText variant="label" color={props.responded ? colors.textPrimary : colors.textMuted} style={styles.statusText}>
        @{props.username}
      </HText>
    </View>
  );
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor:   colors.accent,
    borderRadius:      9999,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    shadowColor:       colors.accent,
    shadowOffset:      { width: 0, height: 0 },
    shadowOpacity:     0.3,
    shadowRadius:      7.5,
    elevation:         3,
  },
  selectedText: { fontSize: 14, letterSpacing: 0.7 },
  status: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   colors.bg,
    borderWidth:       1,
    borderColor:       colors.border,
    borderRadius:      9999,
    paddingHorizontal: 13,
    paddingVertical:   5,
  },
  dot:        { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, letterSpacing: 0.24 },
});
