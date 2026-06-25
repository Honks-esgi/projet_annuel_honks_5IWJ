import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing, typography } from '../../design/tokens';
import { HText } from '../atoms/HText';

type Props = {
  title:  string;
  right?: ReactNode;
  height?: number;
};

export function HScreenHeader({ title, right, height = 60 }: Props) {
  return (
    <View style={[styles.header, { height }]}>
      <HText variant="body" color={colors.textPrimary} style={styles.title}>{title}</HText>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor:   colors.bg,
  },
  title: {
    ...typography.body,
    fontFamily: 'Syne_800ExtraBold',
    fontSize:   20,
  },
});
