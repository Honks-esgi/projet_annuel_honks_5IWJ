import { Image, StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';

type AuthHeaderProps = {
  subtitle: string;
};

export function AuthHeader({ subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/honk-logo.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      <HText variant="displayLg" color={colors.textPrimary}>
        HONKS
      </HText>
      <HText variant="body" color={colors.textMuted}>
        {subtitle}
      </HText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:    'center',
    gap:           spacing.sm,
    width:         '100%',
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    width:           54,
    height:          54,
    backgroundColor: colors.accent,
    borderRadius:    radii.logo,
    alignItems:      'center',
    justifyContent:  'center',
  },
  logo: {
    width:  40,
    height: 40,
  },
});
