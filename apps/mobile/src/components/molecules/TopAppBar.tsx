import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../design/tokens';
import { HText } from '../atoms/HText';
import { StatusDot } from '../atoms/StatusDot';

type Props = { userName: string; notificationCount?: number };

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'BONJOUR,' : 'BONSOIR,';
}

export function TopAppBar({ userName, notificationCount = 0 }: Props) {
  return (
    <View style={styles.container}>
      {/* Left: avatar + greeting */}
      <View style={styles.left}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar} />
          <View style={styles.statusDot}>
            <StatusDot status="online" size={10} />
          </View>
        </View>
        <View>
          <HText variant="label" color={colors.textMuted}>{greeting()}</HText>
          <HText variant="body" color={colors.textPrimary} style={styles.name}>{userName}</HText>
        </View>
      </View>

      {/* Right: notification bell */}
      <TouchableOpacity style={styles.bellBtn}>
        <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <HText variant="caption" color={colors.textOnAccent} style={styles.badgeText}>
              {notificationCount}
            </HText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    height:          65,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { position: 'relative', width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatar: {
    width:        AVATAR_SIZE,
    height:       AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.surfaceAlt,
  },
  statusDot:  { position: 'absolute', bottom: 0, right: 0 },
  name:       { ...typography.body, fontFamily: 'Syne_800ExtraBold', fontSize: 17 },
  bellBtn: {
    width:           38,
    height:          38,
    borderRadius:    10,
    backgroundColor: colors.surfaceAlt,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badge: {
    position:        'absolute',
    top:             -4,
    right:           -4,
    width:           16,
    height:          16,
    borderRadius:    8,
    backgroundColor: colors.accent,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeText: { fontSize: 10, lineHeight: 10 },
});
