import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../../design/tokens';
import { HText } from './HText';

type HTextInputProps = TextInputProps & {
  label:            string;
  error?:           string;
  secureTextEntry?: boolean;
};

export function HTextInput({ label, error, secureTextEntry = false, style, ...props }: HTextInputProps) {
  const [focused,  setFocused]  = useState(false);
  const [revealed, setRevealed] = useState(false);

  const borderColor = error ? colors.error : focused ? colors.accent : colors.border;

  return (
    <View style={styles.wrapper}>
      <HText variant="label" color={colors.textLabel} style={styles.label}>
        {label}
      </HText>
      <View style={[styles.inputRow, { borderColor }]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textPlaceholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry && !revealed}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setRevealed((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={revealed ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <HText variant="label" color={colors.error} style={styles.errorText}>
          {error}
        </HText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap:   spacing.xs,
    width: '100%',
  },
  label: {
    paddingLeft: spacing.xs,
  },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderRadius:    radii.input,
    paddingHorizontal: 13,
    height:          48,
  },
  input: {
    flex:       1,
    ...typography.body,
    color:      colors.textPrimary,
    padding:    0,
    margin:     0,
  },
  errorText: {
    paddingLeft: spacing.xs,
  },
});
