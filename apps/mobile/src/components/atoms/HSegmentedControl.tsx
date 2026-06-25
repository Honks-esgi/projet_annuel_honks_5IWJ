import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../../design/tokens';
import { HText } from './HText';

type Props = {
  tabs:        string[];
  activeIndex: number;
  onSelect:    (index: number) => void;
};

export function HSegmentedControl({ tabs, activeIndex, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((label, i) => (
        <TouchableOpacity
          key={label}
          style={[styles.tab, i === activeIndex && styles.tabActive]}
          onPress={() => onSelect(i)}
          activeOpacity={0.75}
        >
          <HText
            variant="label"
            color={i === activeIndex ? colors.textOnAccent : colors.textMuted}
            style={styles.label}
          >
            {label}
          </HText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    backgroundColor: colors.surface,
    borderRadius:    8,
    padding:         4,
  },
  tab: {
    flex:            1,
    paddingVertical: spacing.sm,
    alignItems:      'center',
    justifyContent:  'center',
    borderRadius:    4,
  },
  tabActive: {
    backgroundColor: colors.accent,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.05,
    shadowRadius:    1,
    elevation:       1,
  },
  label: { fontSize: 14, letterSpacing: 0.5 },
});
