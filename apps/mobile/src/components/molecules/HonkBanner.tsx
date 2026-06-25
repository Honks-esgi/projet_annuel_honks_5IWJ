import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../design/tokens';
import { HText } from '../atoms/HText';

type Props = { onPress: () => void };

export function HonkBanner({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View>
        <HText variant="displayLg" color={colors.textOnAccent} style={styles.title}>
          HONK !
        </HText>
        <HText variant="caption" color={colors.textOnAccent} style={styles.subtitle}>
          Qui est dispo ce soir ?
        </HText>
      </View>
      <View style={styles.iconBtn}>
        <Ionicons name="megaphone-outline" size={22} color={colors.textPrimary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: colors.accent,
    borderRadius:    14,
    padding:         spacing.md,
    height:          72,
  },
  title:    { fontSize: 18, letterSpacing: -0.45, lineHeight: 27 },
  subtitle: { opacity: 0.7, marginTop: 2 },
  iconBtn: {
    width:           40,
    height:          40,
    borderRadius:    10,
    backgroundColor: colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },
});
