import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';
import { StatusDot } from '../atoms/StatusDot';

export type FriendListItem = {
  id:          string;
  name:        string;
  status:      'online' | 'away' | 'offline';
  avatarUrl:   string | null;
  currentGame: string | null;
};

type Props = {
  friend:     FriendListItem;
  onPress:    () => void;
  selectable?: boolean;
  selected?:   boolean;
};

function statusLabel(friend: FriendListItem): string {
  if (friend.status === 'online' && friend.currentGame) return `Joue à ${friend.currentGame}`;
  if (friend.status === 'online') return 'En ligne';
  if (friend.status === 'away')   return 'AFK';
  return 'Hors ligne';
}

function statusColor(status: FriendListItem['status']): string {
  if (status === 'online') return colors.online;
  if (status === 'away')   return colors.danger;
  return colors.textMuted;
}

export function FriendRow({ friend, onPress, selectable = false, selected = false }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar + status dot */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar} />
        <View style={styles.dot}>
          <StatusDot status={friend.status} size={10} />
        </View>
      </View>

      {/* Name + status text */}
      <View style={styles.info}>
        <HText variant="body" color={colors.textPrimary} style={styles.name}>{friend.name}</HText>
        <HText variant="caption" color={statusColor(friend.status)} style={styles.status}>
          {statusLabel(friend)}
        </HText>
      </View>

      {/* Right: selection radio or more button */}
      {selectable ? (
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <Ionicons name="checkmark" size={13} color={colors.textOnAccent} />}
        </View>
      ) : (
        <TouchableOpacity style={styles.moreBtn} onPress={onPress}>
          <Ionicons name="ellipsis-horizontal" size={16} color={colors.textLabel} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const AVATAR = 40;

const styles = StyleSheet.create({
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    padding:         spacing.sm,
    borderRadius:    10,
    backgroundColor: colors.bg,
  },
  avatarWrap: {
    width:    AVATAR,
    height:   AVATAR,
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width:           AVATAR,
    height:          AVATAR,
    borderRadius:    AVATAR / 2,
    backgroundColor: colors.surfaceAlt,
  },
  dot: { position: 'absolute', bottom: 1, right: 1 },
  info: { flex: 1, gap: 2 },
  name: {
    fontFamily: 'Syne_700Bold',
    fontSize:   13,
  },
  status: { fontSize: 10 },
  moreBtn: {
    width:           32,
    height:          32,
    borderRadius:    8,
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  radio: {
    width:           22,
    height:          22,
    borderRadius:    11,
    borderWidth:     1.5,
    borderColor:     colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  radioSelected: {
    backgroundColor: colors.accent,
    borderColor:     colors.accent,
  },
});
