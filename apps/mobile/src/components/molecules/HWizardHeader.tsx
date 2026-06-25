import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../design/tokens';
import { HText } from '../atoms/HText';

type Props = { title: string; onBack: () => void };

export function HWizardHeader({ title, onBack }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
      </TouchableOpacity>
      <HText variant="body" color={colors.textPrimary} style={styles.title}>{title}</HText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height:            64,
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: spacing.xl,
    gap:               spacing.lg,
    backgroundColor:   colors.bg,
  },
  backBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    alignItems:      'center',
    justifyContent:  'center',
  },
  title: {
    ...typography.body,
    fontFamily: 'Syne_800ExtraBold',
    fontSize:   24,
  },
});
