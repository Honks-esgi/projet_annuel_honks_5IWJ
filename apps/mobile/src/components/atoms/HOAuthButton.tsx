import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii } from '../../design/tokens';

type OAuthProvider = 'google' | 'discord';

// React Native require() returns a number (asset registry ID)
const icons: Record<OAuthProvider, number> = {
  google:  require('../../../assets/images/icon-google.svg'),
  discord: require('../../../assets/images/icon-discord.svg'),
};

type HOAuthButtonProps = {
  provider: OAuthProvider;
  onPress:  () => void;
};

export function HOAuthButton({ provider, onPress }: HOAuthButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.button}>
      <Image source={icons[provider]} style={styles.icon} contentFit="contain" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex:            1,
    height:          48,
    borderRadius:    radii.button,
    backgroundColor: colors.surfaceAlt,
    borderWidth:     1,
    borderColor:     colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  icon: {
    width:  22,
    height: 22,
  },
});
