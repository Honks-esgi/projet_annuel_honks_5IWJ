import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../design/tokens';
import { HText } from '../components/atoms/HText';
import { HBadge } from '../components/atoms/HBadge';
import { HButton } from '../components/atoms/HButton';
import { HSearchInput } from '../components/atoms/HSearchInput';
import { HSectionHeader } from '../components/atoms/HSectionHeader';
import { HScreenHeader } from '../components/molecules/HScreenHeader';
import { FriendRow, FriendListItem } from '../components/molecules/FriendRow';
import { FriendRequestCard } from '../components/molecules/FriendRequestCard';
import { FriendProfileSheet } from '../components/molecules/FriendProfileSheet';
import { BottomNavBar } from '../components/molecules/BottomNavBar';
import { useAuthStore } from '../store/auth';
import { getFriendsByStatus, getReceivedFriendRequests } from '../data/helpers';

export function FriendsScreen() {
  const [selectedFriend, setSelectedFriend] = useState<FriendListItem | null>(null);
  const [query, setQuery]                   = useState('');
  const currentUserId = useAuthStore((s) => s.user?.id ?? '');

  const friendRequests = getReceivedFriendRequests(currentUserId);
  const { online: friendsOnline, offline: friendsOffline } = getFriendsByStatus(currentUserId);

  const matchesQuery   = (f: FriendListItem) => !query || f.name.toLowerCase().includes(query.toLowerCase());
  const onlineFiltered  = friendsOnline.filter(matchesQuery);
  const offlineFiltered = friendsOffline.filter(matchesQuery);

  const firstOffline = offlineFiltered.slice(0, 1);
  const hiddenCount  = offlineFiltered.length - 1;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HScreenHeader
        title="Amis"
        right={
          <HButton variant="primary" size="auto" icon="add" label="AJOUTER" onPress={() => {}} />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HSearchInput placeholder="Rechercher un ami .." value={query} onChangeText={setQuery} />

        {/* Demandes */}
        <View style={styles.section}>
          <HSectionHeader
            title="DEMANDES"
            badge={friendRequests.length > 0 ? String(friendRequests.length) : undefined}
          />
          {friendRequests.map((r) => (
            <FriendRequestCard
              key={r.id}
              request={r}
              onAccept={() => {}}
              onDecline={() => {}}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* En ligne */}
        <View style={styles.section}>
          <HSectionHeader
            title="EN LIGNE"
            badge={`${friendsOnline.length}`}
          />
          {onlineFiltered.map((f) => (
            <FriendRow key={f.id} friend={f} onPress={() => setSelectedFriend(f)} />
          ))}
        </View>

        {/* Hors ligne */}
        <View style={styles.section}>
          <HSectionHeader
            title="HORS LIGNE"
            badge={`${offlineFiltered.length}`}
          />
          {firstOffline.map((f) => (
            <FriendRow key={f.id} friend={f} onPress={() => setSelectedFriend(f)} />
          ))}
          {hiddenCount > 0 && (
            <TouchableOpacity style={styles.moreRow}>
              <HText variant="label" color={colors.textMuted}>+ {hiddenCount} autres</HText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <BottomNavBar activeTab="friends" />

      <FriendProfileSheet
        friend={selectedFriend}
        visible={selectedFriend !== null}
        onClose={() => setSelectedFriend(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.xxl, paddingBottom: 100 },
  section: { gap: spacing.lg },
  moreRow: { paddingTop: spacing.md, alignItems: 'center' },
});
