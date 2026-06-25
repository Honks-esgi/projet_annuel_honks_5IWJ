import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../design/tokens';
import { HText } from './HText';

type HDividerProps = {
  label?: string;
};

export function HDivider({ label }: HDividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {label && (
        <>
          <HText variant="label" color={colors.textMuted}>
            {label}
          </HText>
          <View style={styles.line} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
    width:         '100%',
  },
  line: {
    flex:            1,
    height:          1,
    backgroundColor: colors.border,
  },
});
