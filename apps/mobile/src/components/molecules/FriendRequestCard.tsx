import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';

export type FriendRequest = {
  id:            string;
  name:          string;
  avatarUrl:     string | null;
  mutualFriends: number;
  status:        'pending' | 'declined' | 'accepted';
};

type Props = {
  request:   FriendRequest;
  onAccept:  () => void;
  onDecline: () => void;
  onPress:   () => void;
};

const GRADIENT: Record<FriendRequest['status'], readonly [string, string]> = {
  pending:  ['rgba(255,230,0,0.5)',  '#1c1d2b'],
  declined: ['rgba(248,113,113,0.5)', '#1c1d2b'],
  accepted: ['rgba(74,222,128,0.5)',  '#1c1d2b'],
};

export function FriendRequestCard({ request, onAccept, onDecline, onPress }: Props) {
  const grad = GRADIENT[request.status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={grad}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.card}
      >
        {/* Left: avatar + name */}
        <View style={styles.left}>
          <View style={styles.avatar} />
          <View style={styles.info}>
            <HText variant="body" color={colors.textOnAccent} style={styles.name}>{request.name}</HText>
            <HText variant="label" color={colors.textOnAccent} style={styles.mutual}>
              {request.mutualFriends} amis en commun
            </HText>
          </View>
        </View>

        {/* Right: action buttons */}
        <View style={styles.actions}>
          {request.status === 'pending' && (
            <TouchableOpacity style={styles.btn} onPress={onDecline}>
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          {(request.status === 'pending' || request.status === 'accepted') && (
            <TouchableOpacity style={[styles.btn, styles.btnAccept]} onPress={onAccept}>
              <Ionicons name="checkmark" size={18} color={colors.textOnAccent} />
            </TouchableOpacity>
          )}
          {request.status === 'declined' && (
            <TouchableOpacity style={styles.btn} onPress={onDecline}>
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const AVATAR = 40;

const styles = StyleSheet.create({
  card: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        13,
    borderRadius:   radii.button,
    borderWidth:    1,
    borderColor:    colors.border,
  },
  left:   { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width:           AVATAR,
    height:          AVATAR,
    borderRadius:    AVATAR / 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  info:   { gap: 2 },
  name:   { fontFamily: 'Syne_700Bold', fontSize: 15 },
  mutual: { fontSize: 10 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  btn: {
    width:           32,
    height:          32,
    borderRadius:    8,
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  btnAccept: {
    backgroundColor: colors.accent,
    borderColor:     colors.accent,
  },
});
