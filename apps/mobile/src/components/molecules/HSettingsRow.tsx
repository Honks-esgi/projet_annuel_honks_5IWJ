import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';

type Props = {
  label:       string;
  labelColor?: string;
  icon?:       ReactNode;
  right?:      ReactNode;
  chevron?:    boolean;
  onPress?:    () => void;
};

export function HSettingsRow({ label, labelColor, icon, right, chevron, onPress }: Props) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
        <HText variant="bodySmall" color={labelColor ?? colors.textPrimary} style={styles.label}>
          {label}
        </HText>
      </View>
      <View style={styles.right}>
        {right ?? null}
        {chevron && (
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical:   17,
  },
  left:     { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconSlot: { width: 22, alignItems: 'center' },
  label:    { fontFamily: 'Syne_400Regular' },
  right:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
