import { useEffect, useRef } from 'react';
import {
  Animated, Modal, StyleSheet, TouchableOpacity,
  TouchableWithoutFeedback, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';
import { StatusDot } from '../atoms/StatusDot';
import type { FriendListItem } from './FriendRow';

type Props = {
  friend:  FriendListItem | null;
  visible: boolean;
  onClose: () => void;
};

function statusText(friend: FriendListItem): string {
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

export function FriendProfileSheet({ friend, visible, onClose }: Props) {
  const insets     = useSafeAreaInsets();
  const slideAnim  = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue:         0,
        useNativeDriver: true,
        damping:         20,
        stiffness:       180,
      }).start();
    } else {
      slideAnim.setValue(500);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue:         500,
      duration:        220,
      useNativeDriver: true,
    }).start(onClose);
  };

  if (!friend) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      {/* Backdrop — dark layered overlay simulating blur. Replace with:
          import { BlurView } from 'expo-blur'; (run: npx expo install expo-blur)
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject}>
            <TouchableWithoutFeedback onPress={handleClose}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
          </BlurView>
      */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Sheet panel */}
      <Animated.View
        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.handleWrap}>
          <View style={styles.handle} />
        </View>

        {/* User info */}
        <View style={styles.userInfo}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar} />
            <View style={styles.dot}>
              <StatusDot status={friend.status} size={10} />
            </View>
          </View>
          <View>
            <HText variant="body" color={colors.textPrimary} style={styles.userName}>{friend.name}</HText>
            <HText variant="caption" color={statusColor(friend.status)} style={styles.userStatus}>
              {statusText(friend)}
            </HText>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.action, styles.actionHighlighted]}>
            <Ionicons name="person-outline" size={22} color={colors.textPrimary} />
            <HText variant="bodySmall" color={colors.textPrimary}>Voir le profil</HText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action}>
            <Ionicons name="chatbubble-outline" size={22} color={colors.textPrimary} />
            <HText variant="bodySmall" color={colors.textPrimary}>Envoyer un message</HText>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.action}>
            <View style={styles.dangerIcon}>
              <Ionicons name="ban-outline" size={22} color={colors.danger} />
            </View>
            <HText variant="bodySmall" color={colors.danger}>Bloquer</HText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const AVATAR = 46;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  sheet: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: colors.bg,
    borderTopLeftRadius:  20,
    borderTopRightRadius: 20,
    borderTopWidth:       1,
    borderColor:          colors.border,
  },
  handleWrap: {
    alignItems:    'center',
    paddingTop:    10,
    paddingBottom: 4,
  },
  handle: {
    width:           36,
    height:          4,
    borderRadius:    2,
    backgroundColor: colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarWrap: { position: 'relative', width: AVATAR, height: AVATAR },
  avatar: {
    width:           AVATAR,
    height:          AVATAR,
    borderRadius:    AVATAR / 2,
    backgroundColor: colors.surfaceAlt,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  dot:        { position: 'absolute', bottom: 2, right: 2 },
  userName:   { fontFamily: 'Syne_700Bold', fontSize: 15, letterSpacing: 0.375 },
  userStatus: { fontSize: 11, marginTop: 2 },
  separator:  { height: spacing.sm },
  actions:    { paddingHorizontal: spacing.lg, gap: 2 },
  action: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
    padding:       spacing.md,
    borderRadius:  6,
  },
  actionHighlighted: { backgroundColor: colors.surface },
  divider: {
    height:          1,
    backgroundColor: colors.border,
    marginVertical:  spacing.sm,
  },
  dangerIcon: {
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: colors.dangerSubtle,
    alignItems:      'center',
    justifyContent:  'center',
  },
});
