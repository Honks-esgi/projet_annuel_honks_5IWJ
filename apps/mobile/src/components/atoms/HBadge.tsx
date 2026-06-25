import { StyleSheet, View } from 'react-native';
import { colors } from '../../design/tokens';
import { HText } from './HText';

type PillProps = {
  variant: 'pill';
  label:   string;
  color?:  string;
  bg?:     string;
  border?: string;
};

type CountProps = {
  variant: 'count';
  label:   string | number;
  size?:   number;
  bg?:     string;
};

type Props = PillProps | CountProps;

export function HBadge(props: Props) {
  if (props.variant === 'pill') {
    const bg     = props.bg     ?? colors.accentSubtle;
    const border = props.border ?? colors.accentBorder;
    const color  = props.color  ?? colors.accent;
    return (
      <View style={[styles.pill, { backgroundColor: bg, borderColor: border }]}>
        <HText variant="label" color={color} style={styles.pillText}>
          {props.label}
        </HText>
      </View>
    );
  }

  const size = props.size ?? 22;
  const bg   = props.bg   ?? colors.accent;
  return (
    <View style={[styles.count, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <HText variant="caption" color={colors.textOnAccent} style={[styles.countText, { fontSize: size * 0.52 }]}>
        {props.label}
      </HText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius:      4,
    borderWidth:       1,
    paddingHorizontal: 7,
    paddingVertical:   3,
  },
  pillText: { fontSize: 10, letterSpacing: 0.24 },
  count: {
    alignItems:      'center',
    justifyContent:  'center',
  },
  countText: { letterSpacing: 0 },
});
