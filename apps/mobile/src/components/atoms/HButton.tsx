import { ActivityIndicator, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '../../design/tokens';
import { HText } from './HText';

type HButtonProps = {
  variant:    'primary' | 'ghost';
  label:      string;
  onPress:    () => void;
  loading?:   boolean;
  disabled?:  boolean;
  style?:     ViewStyle;
  icon?:      React.ComponentProps<typeof Ionicons>['name'];
  size?:      'full' | 'auto';
};

export function HButton({ variant, label, onPress, loading, disabled, style, icon, size = 'full' }: HButtonProps) {
  const isPrimary = variant === 'primary';
  const textColor  = isPrimary ? colors.textOnAccent : colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        size === 'full' ? styles.full : styles.auto,
        isPrimary ? styles.primary : styles.ghost,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.inner}>
          {icon && <Ionicons name={icon} size={14} color={textColor} />}
          <HText variant={isPrimary ? 'button' : 'buttonSm'} color={textColor}>
            {label}
          </HText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius:    radii.button,
    paddingVertical: spacing.md + 2,
    alignItems:      'center',
    justifyContent:  'center',
  },
  full:  { width: '100%' },
  auto:  { alignSelf: 'flex-start', paddingHorizontal: spacing.md },
  inner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  primary: {
    backgroundColor: colors.accent,
    shadowColor:     colors.accent,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.2,
    shadowRadius:    7,
    elevation:       4,
  },
  ghost: {
    backgroundColor: colors.surfaceAlt,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
});
