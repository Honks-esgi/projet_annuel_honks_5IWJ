import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../store/auth';
import { colors, spacing } from '../design/tokens';
import { TopAppBar } from '../components/molecules/TopAppBar';
import { HonkBanner } from '../components/molecules/HonkBanner';
import { HonkCard } from '../components/molecules/HonkCard';
import { SessionCard } from '../components/molecules/SessionCard';
import { FriendAvatar } from '../components/molecules/FriendAvatar';
import { BottomNavBar } from '../components/molecules/BottomNavBar';
import { HSectionHeader } from '../components/atoms/HSectionHeader';
import { getAllReceivedHonks, getActiveSessions, getOnlineFriendAvatars } from '../data/helpers';

export function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.id ?? '';

  const receivedHonks  = getAllReceivedHonks(currentUserId).filter((h) => h.response === 'PENDING');
  const activeSessions = getActiveSessions(currentUserId);
  const onlineFriends  = getOnlineFriendAvatars(currentUserId);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <TopAppBar userName={user?.name ?? ''} notificationCount={2} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HONK CTA Banner */}
        <HonkBanner onPress={() => router.push('/(app)/honk-wizard')} />

        {/* HONKS REÇUS */}
        <View style={styles.section}>
          <HSectionHeader
            title="HONKS REÇUS"
            badge={`${receivedHonks.length} EN ATTENTE`}
            action="TOUT VOIR"
            onAction={() => {}}
          />
          {receivedHonks.map((honk) => (
            <HonkCard key={honk.id} honk={honk} onAccept={() => {}} onDecline={() => {}} />
          ))}
        </View>

        {/* SESSIONS ACTIVES */}
        <View style={styles.section}>
          <HSectionHeader title="SESSIONS ACTIVES" action="Voir tout" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breakout} contentContainerStyle={styles.sessionsRow}>
            {activeSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </ScrollView>
        </View>

        {/* AMIS EN LIGNE */}
        <View style={styles.section}>
          <HSectionHeader title="AMIS EN LIGNE" badge={`${onlineFriends.filter(f => f.status === 'online').length} EN LIGNE`} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsRow}
          >
            {onlineFriends.map((f) => (
              <FriendAvatar key={f.id} friend={f} />
            ))}
            <FriendAvatar addButton onPress={() => {}} />
          </ScrollView>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="home" honkBadge={receivedHonks.length} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors.bg },
  scroll:      { flex: 1 },
  content:     { padding: spacing.xl, gap: spacing.xl },
  section:     { gap: spacing.md },
  breakout:    { marginHorizontal: -spacing.xl },
  sessionsRow: { gap: spacing.md, paddingHorizontal: spacing.xl },
  friendsRow:  { gap: spacing.xl, paddingVertical: spacing.sm },
});
