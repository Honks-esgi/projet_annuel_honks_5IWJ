import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../design/tokens';

type Props = TextInputProps & { placeholder?: string };

export function HSearchInput({ placeholder = 'Rechercher ..', ...props }: Props) {
  const hasValue = Boolean(props.value);

  return (
    <View style={styles.wrap}>
      <Ionicons name="search-outline" size={16} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        {...props}
      />
      {hasValue && (
        <TouchableOpacity onPress={() => props.onChangeText?.('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               spacing.sm,
    backgroundColor:   colors.surface,
    borderWidth:       1,
    borderColor:       colors.textMuted,
    borderRadius:      10,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm + 1,
  },
  input: {
    flex:   1,
    ...typography.body,
    color:  colors.textPrimary,
    height: 32,
    padding: 0,
  },
});
