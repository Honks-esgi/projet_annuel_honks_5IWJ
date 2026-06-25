import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';
import { StatusDot } from '../atoms/StatusDot';

export type FriendItem = {
  id:        string;
  name:      string;
  status:    'online' | 'away' | 'offline';
  avatarUrl: string | null;
};

type Props =
  | { friend: FriendItem; addButton?: false }
  | { addButton: true; onPress: () => void };

const AVATAR = 44;

export function FriendAvatar(props: Props) {
  if ('addButton' in props && props.addButton) {
    return (
      <TouchableOpacity style={styles.wrap} onPress={props.onPress}>
        <View style={[styles.avatar, styles.addCircle]}>
          <Ionicons name="add" size={22} color={colors.textMuted} />
        </View>
        <HText variant="caption" color={colors.textMuted} style={styles.label}>Ajouter</HText>
      </TouchableOpacity>
    );
  }

  const { friend } = props as { friend: FriendItem };

  return (
    <View style={styles.wrap}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar} />
        <View style={styles.dot}>
          <StatusDot status={friend.status} size={10} />
        </View>
      </View>
      <HText variant="caption" color={colors.textMuted} style={styles.label} numberOfLines={1}>
        {friend.name}
      </HText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:      { width: 50, alignItems: 'center', gap: 4 },
  avatarWrap: { position: 'relative', width: AVATAR, height: AVATAR },
  avatar: {
    width:           AVATAR,
    height:          AVATAR,
    borderRadius:    AVATAR / 2,
    backgroundColor: colors.surfaceAlt,
  },
  addCircle: {
    borderWidth:     1,
    borderColor:     colors.textMuted,
    borderStyle:     'dashed',
    backgroundColor: 'transparent',
    alignItems:      'center',
    justifyContent:  'center',
  },
  dot:   { position: 'absolute', bottom: 0, right: 0 },
  label: { fontSize: 10, textAlign: 'center' },
});
