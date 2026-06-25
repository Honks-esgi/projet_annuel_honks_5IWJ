import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../design/tokens';
import { HText } from '../components/atoms/HText';
import { HBadge } from '../components/atoms/HBadge';
import { HToggle } from '../components/atoms/HToggle';
import { HStatusChip, UserStatus } from '../components/atoms/HStatusChip';
import { HScreenHeader } from '../components/molecules/HScreenHeader';
import { HSettingsCard } from '../components/molecules/HSettingsCard';
import { HSettingsRow } from '../components/molecules/HSettingsRow';
import { BottomNavBar } from '../components/molecules/BottomNavBar';
import { StatusDot } from '../components/atoms/StatusDot';
import { useAuthStore } from '../store/auth';

const ALL_STATUSES: UserStatus[] = ['online', 'away', 'dnd', 'offline'];

type Notifs = { honks: boolean; sessions: boolean; friendRequests: boolean; invitations: boolean };

export function SettingsScreen() {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const [status, setStatus]  = useState<UserStatus>('online');
  const [notifs, setNotifs]  = useState<Notifs>({
    honks: true, sessions: true, friendRequests: true, invitations: false,
  });

  const toggle = (key: keyof Notifs) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HScreenHeader title="Paramètres" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User card */}
        <TouchableOpacity style={styles.userCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar} />
            <View style={styles.statusDot}>
              <StatusDot status={status === 'online' ? 'online' : status === 'away' ? 'away' : 'offline'} size={10} />
            </View>
          </View>
          <View style={styles.userInfo}>
            <HText variant="body" color={colors.textPrimary} style={styles.userName}>
              {user?.name ?? ''}
            </HText>
            <HText variant="label" color={colors.textMuted}>{user?.email ?? ''}</HText>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Mon statut */}
        <View style={styles.section}>
          <HText variant="label" color={colors.textMuted} style={styles.sectionLabel}>MON STATUT</HText>
          <View style={styles.statusGrid}>
            {ALL_STATUSES.map((s) => (
              <HStatusChip
                key={s}
                status={s}
                active={status === s}
                onPress={() => setStatus(s)}
              />
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <HText variant="label" color={colors.textMuted} style={styles.sectionLabel}>NOTIFICATIONS</HText>
          <HSettingsCard>
            <HSettingsRow
              label="Honks reçus"
              icon={<Ionicons name="megaphone-outline" size={18} color={colors.textPrimary} />}
              right={<HToggle value={notifs.honks} onValueChange={() => toggle('honks')} />}
            />
            <HSettingsRow
              label="Sessions créées"
              icon={<Ionicons name="game-controller-outline" size={18} color={colors.textPrimary} />}
              right={<HToggle value={notifs.sessions} onValueChange={() => toggle('sessions')} />}
            />
            <HSettingsRow
              label="Demandes d'amis"
              icon={<Ionicons name="person-add-outline" size={18} color={colors.textPrimary} />}
              right={<HToggle value={notifs.friendRequests} onValueChange={() => toggle('friendRequests')} />}
            />
            <HSettingsRow
              label="Invitations de session"
              icon={<Ionicons name="mail-outline" size={18} color={colors.textPrimary} />}
              right={<HToggle value={notifs.invitations} onValueChange={() => toggle('invitations')} />}
            />
          </HSettingsCard>
        </View>

        {/* Compte */}
        <View style={styles.section}>
          <HText variant="label" color={colors.textMuted} style={styles.sectionLabel}>COMPTE</HText>
          <HSettingsCard>
            <HSettingsRow label="Modifier le profil" chevron onPress={() => {}} />
            <HSettingsRow label="Changer le mot de passe" chevron onPress={() => {}} />
            <HSettingsRow
              label="Comptes liés"
              right={
                <HBadge
                  variant="pill"
                  label="GOOGLE"
                  bg={colors.onlineSubtle}
                  color={colors.online}
                  border={colors.online}
                />
              }
            />
          </HSettingsCard>
        </View>

        {/* Application */}
        <View style={styles.section}>
          <HText variant="label" color={colors.textMuted} style={styles.sectionLabel}>APPLICATION</HText>
          <HSettingsCard>
            <HSettingsRow
              label="Langue"
              right={<HText variant="label" color={colors.textMuted}>Français</HText>}
            />
            <HSettingsRow
              label="Version"
              right={<HText variant="label" color={colors.textMuted}>1.0.0</HText>}
            />
          </HSettingsCard>
        </View>

        {/* Danger zone */}
        <HSettingsCard variant="danger">
          <HSettingsRow
            label="Se déconnecter"
            labelColor={colors.danger}
            icon={
              <View style={styles.dangerIcon}>
                <Ionicons name="log-out-outline" size={16} color={colors.danger} />
              </View>
            }
            onPress={logout}
          />
          <HSettingsRow
            label="Supprimer le compte"
            labelColor={colors.danger}
            icon={
              <View style={styles.dangerIcon}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
              </View>
            }
            onPress={() => {}}
          />
        </HSettingsCard>
      </ScrollView>

      <BottomNavBar activeTab="settings" />
    </SafeAreaView>
  );
}

const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.xxl, paddingBottom: 100 },

  userCard: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing.md,
    backgroundColor: colors.surface,
    borderRadius:    12,
    padding:         spacing.lg,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  avatarWrap: { position: 'relative', width: AVATAR_SIZE, height: AVATAR_SIZE },
  avatar: {
    width:           AVATAR_SIZE,
    height:          AVATAR_SIZE,
    borderRadius:    AVATAR_SIZE / 2,
    backgroundColor: colors.surfaceAlt,
  },
  statusDot: { position: 'absolute', bottom: 0, right: 0 },
  userInfo:  { flex: 1, gap: 2 },
  userName:  { fontFamily: 'Syne_800ExtraBold', fontSize: 17 },

  section:      { gap: spacing.md },
  sectionLabel: { letterSpacing: 1.2, paddingLeft: spacing.xs },

  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  dangerIcon: {
    width:           32,
    height:          32,
    borderRadius:    8,
    backgroundColor: colors.dangerSubtle,
    alignItems:      'center',
    justifyContent:  'center',
  },
});
