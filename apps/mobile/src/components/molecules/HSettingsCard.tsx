import { Children, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../design/tokens';

type Props = { children: ReactNode; variant?: 'default' | 'danger' };

export function HSettingsCard({ children, variant = 'default' }: Props) {
  const borderColor =
    variant === 'danger' ? 'rgba(248,113,113,0.3)' : 'rgba(46,48,72,0.5)';
  const dividerColor =
    variant === 'danger' ? 'rgba(248,113,113,0.2)' : colors.border;

  const items = Children.toArray(children);

  return (
    <View style={[styles.card, { borderColor }]}>
      {items.map((child, i) => (
        <View key={i} style={i < items.length - 1 ? [styles.divider, { borderBottomColor: dividerColor }] : undefined}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    overflow:        'hidden',
  },
  divider: {
    borderBottomWidth: 1,
  },
});
