import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../design/tokens';
import { HText } from '../atoms/HText';

export type GameItem = {
  id:         string;
  name:       string;
  coverUrl:   string | null;
  isFavorite: boolean;
  platforms:  string[];
};

type Props = {
  game:       GameItem;
  onPress?:   () => void;
  selectable?: boolean;
  selected?:   boolean;
};

const CARD_WIDTH  = 106;
const CARD_HEIGHT = 141;

export function GameCard({ game, onPress, selectable = false, selected = false }: Props) {
  const initial = game.name.charAt(0);
  const showAccentBorder = selected || game.isFavorite;
  const borderWidth = selected ? 2 : 1;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        showAccentBorder && { borderColor: colors.accent, borderWidth },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Cover image or placeholder */}
      {game.coverUrl ? (
        <Image source={{ uri: game.coverUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={styles.coverPlaceholder}>
          <HText variant="displayLg" color={colors.textMuted} style={styles.initial}>
            {initial}
          </HText>
        </View>
      )}

      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(18,19,26,0.4)', 'rgba(18,19,26,0.9)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Badge: checkmark when selected, star when favorite-only */}
      {selectable && selected ? (
        <View style={styles.badgeWrap}>
          <Ionicons name="checkmark" size={12} color={colors.textOnAccent} />
        </View>
      ) : game.isFavorite ? (
        <View style={[styles.badgeWrap, styles.badgeStar]}>
          <Ionicons name="star" size={10} color={colors.accent} />
        </View>
      ) : null}

      {/* Game name */}
      <View style={styles.nameWrap}>
        <HText variant="caption" color={colors.textPrimary} style={styles.name} numberOfLines={2}>
          {game.name}
        </HText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width:            CARD_WIDTH,
    height:           CARD_HEIGHT,
    borderRadius:     8,
    backgroundColor:  colors.card,
    overflow:         'hidden',
    borderWidth:      1,
    borderColor:      colors.border,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
  },
  coverPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: colors.card,
  },
  initial: {
    fontSize: 36,
    opacity:  0.2,
  },
  badgeWrap: {
    position:        'absolute',
    top:             6,
    right:           6,
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: colors.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeStar: {
    backgroundColor: colors.bg,
  },
  nameWrap: {
    position: 'absolute',
    bottom:   8,
    left:     6,
    right:    6,
  },
  name: {
    fontFamily: 'Syne_700Bold',
    fontSize:   12,
    lineHeight: 16,
  },
});
