import { StyleSheet, View } from 'react-native';
import { colors, spacing, radii } from '../../design/tokens';
import { HText } from '../atoms/HText';

export type SessionData = {
  id:       string;
  game:     string;
  coverUrl: string | null;
  players:  { id: string; role: string }[];
};

type Props = { session: SessionData };

export function SessionCard({ session }: Props) {
  return (
    <View style={styles.card}>
      {/* Game cover */}
      <View style={styles.left}>
        <View style={styles.coverWrap}>
          <View style={styles.cover} />
        </View>
        <View style={styles.info}>
          <HText variant="body" color={colors.textPrimary} style={styles.gameName}>
            {session.game}
          </HText>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <HText variant="caption" color={colors.online} style={styles.liveText}>LIVE</HText>
          </View>
        </View>
      </View>
      {/* Overlapping avatars */}
      {session.players.length > 0 && (
        <View style={styles.avatars}>
          {session.players.slice(0, 3).map((_, i) => (
            <View key={i} style={[styles.playerAvatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 3 - i }]} />
          ))}
        </View>
      )}
      {session.players.length === 0 && (
        <View style={styles.avatars}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.playerAvatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 3 - i }]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: colors.bg,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    radii.button,
    padding:         13,
  },
  left:     { flexDirection: 'row', alignItems: 'center', gap: 16 },
  coverWrap: {
    width:           40,
    height:          40,
    borderRadius:    8,
    backgroundColor: colors.surfaceAlt,
    borderWidth:     1,
    borderColor:     colors.border,
    overflow:        'hidden',
    alignItems:      'center',
    justifyContent:  'center',
  },
  cover: { width: 40, height: 40, backgroundColor: colors.surface },
  info: { gap: 4 },
  gameName: { fontSize: 15, fontFamily: 'Syne_700Bold', lineHeight: 15 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: colors.online,
    shadowColor:     colors.online,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.6,
    shadowRadius:    4,
    elevation:       2,
  },
  liveText: { letterSpacing: 1 },
  avatars:  { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
  playerAvatar: {
    width:        32,
    height:       32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    borderWidth:  1,
    borderColor:  colors.bg,
  },
});
