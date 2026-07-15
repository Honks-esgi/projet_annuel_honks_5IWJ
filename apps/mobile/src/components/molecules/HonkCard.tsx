import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';
import { StatusDot } from '../atoms/StatusDot';
import type { AllReceivedHonk } from '../../data/helpers';

type Props = {
  honk:       AllReceivedHonk;
  onAccept?:  () => void;
  onDecline?: () => void;
};

const URGENT_MIN = 5;

type Variant = 'pending' | 'urgent' | 'accepted' | 'declined';

function resolveVariant(honk: AllReceivedHonk): Variant {
  if (honk.response === 'ACCEPTED') return 'accepted';
  if (honk.response === 'DECLINED') return 'declined';
  return honk.expiresInMin <= URGENT_MIN ? 'urgent' : 'pending';
}

const GRADIENT_START: Record<Variant, string> = {
  pending:  'rgba(253,228,0,0.07)',
  urgent:   'rgba(251,146,60,0.07)',
  accepted: 'rgba(74,222,128,0.07)',
  declined: 'rgba(248,113,113,0.07)',
};

const ACCENT: Record<Variant, string> = {
  pending:  colors.accent,
  urgent:   colors.away,
  accepted: colors.online,
  declined: colors.danger,
};

export function HonkCard({ honk, onAccept, onDecline }: Props) {
  const variant = resolveVariant(honk);
  const accent  = ACCENT[variant];
  const initial = honk.from.name.charAt(0).toUpperCase();

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[GRADIENT_START[variant], colors.surface]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 0.85 }}
      />

      {/* Top row: sender + timer badge */}
      <View style={styles.topRow}>
        <View style={styles.senderWrap}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <HText variant="label" color={colors.textMuted} style={styles.initial}>{initial}</HText>
            </View>
            <View style={styles.statusDot}>
              <StatusDot status="online" size={8} />
            </View>
          </View>
          <View style={styles.senderInfo}>
            <HText variant="body" color={colors.textPrimary} style={styles.senderName}>
              {honk.from.name.split(' ')[0]}
            </HText>
            <HText variant="caption" color={colors.textPrimary} style={styles.senderMeta}>
              {honk.game} · il y a {honk.sentAt}
            </HText>
          </View>
        </View>

        {(variant === 'pending' || variant === 'urgent') && (
          <View style={[
            styles.timerBadge,
            {
              backgroundColor: variant === 'urgent' ? 'rgba(251,146,60,0.08)' : colors.accentSubtle,
              borderColor:     variant === 'urgent' ? 'rgba(251,146,60,0.25)' : colors.accentBorder,
            },
          ]}>
            <Ionicons name="time-outline" size={10} color={accent} />
            <HText variant="caption" color={accent} style={styles.timerText}>
              {honk.expiresInMin} min
            </HText>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.buttons}>
        {(variant === 'pending' || variant === 'urgent') ? (
          <>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: accent }]}
              onPress={onAccept}
              activeOpacity={0.8}
            >
              <HText variant="label" color={colors.textOnAccent} style={styles.btnText}>HONK !</HText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnNoHonk]}
              onPress={onDecline}
              activeOpacity={0.8}
            >
              <HText variant="label" color={colors.textMuted} style={styles.btnText}>NO HONK</HText>
            </TouchableOpacity>
          </>
        ) : variant === 'accepted' ? (
          <View style={[styles.btn, styles.btnFull, { backgroundColor: colors.online }]}>
            <HText variant="label" color={colors.textOnAccent} style={styles.btnText}>HONKED</HText>
          </View>
        ) : (
          <View style={[styles.btn, styles.btnFull, { backgroundColor: colors.danger }]}>
            <HText variant="label" color={colors.textOnAccent} style={styles.btnText}>NO-HONK</HText>
          </View>
        )}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 32;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth:  1,
    borderColor:  colors.border,
    padding:      17,
    gap:          spacing.lg,
    overflow:     'hidden',
  },
  topRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
  },
  senderWrap: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  avatarWrap: { width: AVATAR_SIZE, height: AVATAR_SIZE, position: 'relative' },
  avatar: {
    width:           AVATAR_SIZE,
    height:          AVATAR_SIZE,
    borderRadius:    AVATAR_SIZE / 2,
    backgroundColor: colors.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
    overflow:        'hidden',
  },
  initial:   { fontSize: 13 },
  statusDot: { position: 'absolute', bottom: 0, right: 0 },
  senderInfo: { gap: 2 },
  senderName: { fontFamily: 'Syne_700Bold', fontSize: 14, lineHeight: 21 },
  senderMeta: { fontSize: 10, lineHeight: 15 },
  timerBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: 9,
    paddingVertical:   5,
    borderRadius:      6,
    borderWidth:       1,
  },
  timerText: { fontSize: 10, lineHeight: 15 },
  buttons: {
    flexDirection: 'row',
    gap:           spacing.sm,
    paddingTop:    spacing.xs,
  },
  btn: {
    flex:           1,
    height:         40,
    borderRadius:   8,
    alignItems:     'center',
    justifyContent: 'center',
  },
  btnNoHonk: { backgroundColor: colors.bg },
  btnFull:   {},
  btnText: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      12,
    letterSpacing: 0.6,
  },
});
