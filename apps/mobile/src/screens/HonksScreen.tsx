import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../design/tokens';
import { HText } from '../components/atoms/HText';
import { HSegmentedControl } from '../components/atoms/HSegmentedControl';
import { HonkCard } from '../components/molecules/HonkCard';
import { BottomNavBar } from '../components/molecules/BottomNavBar';
import { useAuthStore } from '../store/auth';
import { getAllReceivedHonks } from '../data/helpers';
import type { AllReceivedHonk } from '../data/helpers';

const TABS = ['EN ATTENTE', 'ACCEPTÉS', 'REFUSÉS'];

export function HonksScreen() {
  const currentUserId = useAuthStore((s) => s.user?.id ?? '');
  const [tabIdx, setTabIdx] = useState(0);

  // Local response overrides — simulates API mutation
  const [responses, setResponses] = useState<Record<string, 'ACCEPTED' | 'DECLINED'>>({});

  const allHonks: AllReceivedHonk[] = getAllReceivedHonks(currentUserId).map((h) => ({
    ...h,
    response: (responses[h.id] ?? h.response) as AllReceivedHonk['response'],
  }));

  const pending  = allHonks.filter((h) => h.response === 'PENDING');
  const accepted = allHonks.filter((h) => h.response === 'ACCEPTED');
  const declined = allHonks.filter((h) => h.response === 'DECLINED');
  const lists    = [pending, accepted, declined];

  const respond = (honkId: string, response: 'ACCEPTED' | 'DECLINED') => {
    setResponses((prev) => ({ ...prev, [honkId]: response }));
  };

  const EMPTY_LABELS = ['en attente', 'accepté', 'refusé'];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7}>
          <Ionicons name="menu" size={22} color={colors.textLabel} />
        </TouchableOpacity>

        <HText variant="displayLg" color={colors.accent} style={styles.title}>HONKS</HText>

        <TouchableOpacity
          style={styles.honkBtn}
          onPress={() => router.push('/(app)/honk-wizard')}
          activeOpacity={0.85}
        >
          <Ionicons name="megaphone" size={15} color={colors.textOnAccent} />
          <HText variant="label" color={colors.textOnAccent} style={styles.honkBtnText}>HONK</HText>
        </TouchableOpacity>
      </View>

      <View style={styles.headerDivider} />

      {/* Filter tabs */}
      <View style={styles.tabsWrap}>
        <HSegmentedControl tabs={TABS} activeIndex={tabIdx} onSelect={setTabIdx} />
      </View>

      {/* List */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {lists[tabIdx].length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="megaphone-outline" size={36} color={colors.textMuted} />
            <HText variant="label" color={colors.textMuted} style={styles.emptyText}>
              Aucun honk {EMPTY_LABELS[tabIdx]}
            </HText>
          </View>
        ) : (
          lists[tabIdx].map((honk) => (
            <HonkCard
              key={honk.id}
              honk={honk}
              onAccept={()  => respond(honk.id, 'ACCEPTED')}
              onDecline={() => respond(honk.id, 'DECLINED')}
            />
          ))
        )}
      </ScrollView>

      <BottomNavBar activeTab="honks" honkBadge={pending.length} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: colors.bg },
  header: {
    height:            64,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: spacing.xl,
  },
  menuBtn: {
    width:  40,
    height: 40,
    alignItems:     'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily:    'Syne_800ExtraBold',
    fontSize:      24,
    letterSpacing: -1.2,
    textTransform: 'uppercase',
  },
  honkBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   colors.accent,
    borderRadius:      4,
    paddingHorizontal: spacing.sm,
    paddingVertical:   4,
  },
  honkBtnText: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      16,
    lineHeight:    24,
    color:         colors.textOnAccent,
  },
  headerDivider: {
    height:          1,
    backgroundColor: colors.border,
  },
  tabsWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop:        spacing.lg,
    paddingBottom:     spacing.sm,
  },
  scroll:  { flex: 1 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop:        spacing.lg,
    paddingBottom:     spacing.xxl,
    gap:               spacing.xl,
  },
  emptyWrap: {
    alignItems:  'center',
    paddingTop:  60,
    gap:         spacing.md,
  },
  emptyText: { textAlign: 'center', letterSpacing: 0.24, textTransform: 'uppercase' },
});
