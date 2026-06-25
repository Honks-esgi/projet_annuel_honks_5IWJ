import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../../design/tokens';
import { HText } from './HText';

type Props = {
  title:     string;
  badge?:    string;
  action?:   string;
  onAction?: () => void;
};

export function HSectionHeader({ title, badge, action, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <HText variant="sectionTitle" color={colors.textPrimary}>{title}</HText>
        {badge ? (
          <HText variant="caption" color={colors.textMuted} style={styles.badge}>{badge}</HText>
        ) : null}
      </View>
      {action ? (
        <TouchableOpacity onPress={onAction}>
          <HText variant="caption" color={colors.accent}>{action}</HText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { },
});
