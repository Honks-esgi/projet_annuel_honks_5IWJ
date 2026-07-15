import { Text, TextProps } from 'react-native';
import { colors, typography } from '../../design/tokens';

type TypographyVariant = keyof typeof typography;

type HTextProps = TextProps & {
  variant: TypographyVariant;
  color?: string;
};

export function HText({ variant, color, style, ...props }: HTextProps) {
  return (
    <Text
      style={[typography[variant], { color: color ?? colors.textPrimary }, style]}
      {...props}
    />
  );
}
