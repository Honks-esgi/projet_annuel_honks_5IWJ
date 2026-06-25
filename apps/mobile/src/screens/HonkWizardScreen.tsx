import { useState } from 'react';
import {
  ScrollView, StyleSheet, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../design/tokens';
import { HText } from '../components/atoms/HText';
import { HButton } from '../components/atoms/HButton';
import { HSearchInput } from '../components/atoms/HSearchInput';
import { HSectionHeader } from '../components/atoms/HSectionHeader';
import { HProgressBar } from '../components/atoms/HProgressBar';
import { HSegmentedControl } from '../components/atoms/HSegmentedControl';
import { HRecipientTag } from '../components/atoms/HRecipientTag';
import { HWizardHeader } from '../components/molecules/HWizardHeader';
import { GameCard, GameItem } from '../components/molecules/GameCard';
import { FriendRow, FriendListItem } from '../components/molecules/FriendRow';
import { HHonkRecapCard } from '../components/molecules/HHonkRecapCard';
import { useAuthStore } from '../store/auth';
import { getGames, getAllFriends } from '../data/helpers';
import mock from '../data/mock.json';

const PLATFORM_TABS  = mock.platformFilters;           // ["TOUS","PC","PS5","XBOX","MOBILE"]
const FRIEND_TABS    = ['AMIS', 'FLOCKS', 'AUTRE'];
const EXPIRY_TABS    = ['15MN', '30MN', '60MN'];
const EXPIRY_VALUES  = [15, 30, 60] as const;

function matchesPlatform(platform: string, filter: string): boolean {
  const p = platform.toUpperCase();
  if (filter === 'PC')     return p === 'PC';
  if (filter === 'PS5')    return p === 'PS5' || p === 'PS4';
  if (filter === 'XBOX')   return p.startsWith('XBOX');
  if (filter === 'MOBILE') return p === 'MOBILE';
  return true;
}

type Step = 1 | 2 | 3 | 4;

export function HonkWizardScreen() {
  const insets        = useSafeAreaInsets();
  const currentUserId = useAuthStore((s) => s.user?.id ?? '');
  const { gameId }    = useLocalSearchParams<{ gameId?: string }>();

  // Data (declared early so we can resolve the pre-selected game)
  const allGames   = getGames();
  const allFriends = getAllFriends(currentUserId);

  const preSelectedGame = gameId ? (allGames.find((g) => g.id === gameId) ?? null) : null;

  // Wizard state
  const [step, setStep]                 = useState<Step>(preSelectedGame ? 2 : 1);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(preSelectedGame);
  const [platformIdx, setPlatformIdx]   = useState(0);
  const [gameQuery, setGameQuery]       = useState('');
  const [friendTabIdx, setFriendTabIdx] = useState(0);
  const [friendQuery, setFriendQuery]   = useState('');
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [message, setMessage]           = useState('');
  const [expiryIdx, setExpiryIdx]       = useState(0);

  // Derived
  const platformFilter  = PLATFORM_TABS[platformIdx];
  const filteredGames   = allGames.filter((g) => {
    const matchPlatform = platformFilter === 'TOUS' ||
      g.platforms.some((p) => matchesPlatform(p, platformFilter));
    const matchQuery    = !gameQuery || g.name.toLowerCase().includes(gameQuery.toLowerCase());
    return matchPlatform && matchQuery;
  });
  const favoriteGames   = filteredGames.filter((g) => g.isFavorite);
  const catalogueGames  = filteredGames.filter((g) => !g.isFavorite);

  const filteredFriends = allFriends.filter(
    (f) => !friendQuery || f.name.toLowerCase().includes(friendQuery.toLowerCase()),
  );
  const selectedFriends = allFriends.filter((f) => selectedIds.has(f.id));
  const expiryMin       = EXPIRY_VALUES[expiryIdx];

  const toggleFriend = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else setStep((s) => (s - 1) as Step);
  };

  const STEP_TITLES: Record<1 | 2 | 3, string> = {
    1: 'Choisir un jeu',
    2: 'Destinataires',
    3: 'Envoyer',
  };

  // ─── Step 4 Confirmation ──────────────────────────────────────────────────
  if (step === 4) {
    return (
      <SafeAreaView style={[styles.root, styles.confirmRoot]} edges={['top', 'bottom']}>
        <View style={styles.confirmContent}>
          {/* Game badge */}
          <View style={styles.badgeWrap}>
            <View style={styles.badgeGlow} />
            <View style={styles.badge}>
              <Ionicons name="game-controller-outline" size={28} color={colors.accent} />
            </View>
          </View>

          {/* Title */}
          <View style={styles.confirmTitles}>
            <HText variant="displayLg" color={colors.textPrimary} style={styles.confirmTitle}>
              HONK{'\n'}ENVOYÉ!
            </HText>
            <HText variant="label" color={colors.textMuted} style={styles.confirmSub}>
              {selectedFriends.length} PERSONNE{selectedFriends.length > 1 ? 'S' : ''} ONT ÉTÉ NOTIFIÉE{selectedFriends.length > 1 ? 'S' : ''}
            </HText>
          </View>

          {/* Summary card */}
          <View style={styles.confirmCard}>
            {/* Yellow quarter-circle decoration */}
            <View style={styles.confirmCardAccent} />

            {/* Game row */}
            <View style={styles.confirmGameRow}>
              <View style={styles.confirmGameBadge}>
                <Ionicons name="game-controller-outline" size={20} color={colors.textLabel} />
              </View>
              <View style={styles.confirmGameInfo}>
                <HText variant="body" color={colors.textPrimary} style={styles.confirmGameName}>
                  {selectedGame?.name?.toUpperCase() ?? ''}
                </HText>
                <View style={styles.confirmExpiry}>
                  <View style={[styles.expiryDot, { backgroundColor: colors.accent }]} />
                  <HText variant="label" color={colors.accent} style={styles.confirmExpiryText}>
                    Expire dans {expiryMin} min
                  </HText>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Recipients */}
            <View style={styles.confirmRecipients}>
              {selectedFriends.map((f) => (
                <HRecipientTag
                  key={f.id}
                  variant="status"
                  username={f.name.split(' ')[0]}
                  responded={f.status === 'online'}
                />
              ))}
            </View>
          </View>

          {/* CTA */}
          <HButton
            variant="primary"
            label="RETOUR À L'ACCUEIL"
            size="full"
            onPress={() => router.replace('/(app)/honks')}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Steps 1–3 ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HWizardHeader title={STEP_TITLES[step as 1 | 2 | 3]} onBack={handleBack} />
      <HProgressBar step={step as 1 | 2 | 3} />

      {/* ── STEP 1: Choose game ── */}
      {step === 1 && (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.stepContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <HSearchInput
              placeholder="Rechercher un jeu .."
              value={gameQuery}
              onChangeText={setGameQuery}
            />
            <HSegmentedControl
              tabs={PLATFORM_TABS}
              activeIndex={platformIdx}
              onSelect={setPlatformIdx}
            />

            {favoriteGames.length > 0 && (
              <View style={styles.section}>
                <HSectionHeader title="MES FAVORIS" />
                <View style={styles.grid}>
                  {favoriteGames.map((g) => (
                    <GameCard
                      key={g.id}
                      game={g}
                      selectable
                      selected={selectedGame?.id === g.id}
                      onPress={() => setSelectedGame(g)}
                    />
                  ))}
                </View>
              </View>
            )}

            {catalogueGames.length > 0 && (
              <View style={styles.section}>
                <HSectionHeader title="CATALOGUE" />
                <View style={styles.grid}>
                  {catalogueGames.map((g) => (
                    <GameCard
                      key={g.id}
                      game={g}
                      selectable
                      selected={selectedGame?.id === g.id}
                      onPress={() => setSelectedGame(g)}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <HButton
              variant="primary"
              label="SUIVANT"
              size="full"
              disabled={!selectedGame}
              onPress={() => setStep(2)}
            />
          </View>
        </>
      )}

      {/* ── STEP 2: Recipients ── */}
      {step === 2 && (
        <>
          <View style={styles.step2Fixed}>
            <HSegmentedControl
              tabs={FRIEND_TABS}
              activeIndex={friendTabIdx}
              onSelect={setFriendTabIdx}
            />
            <HSearchInput
              placeholder="Rechercher un ami"
              value={friendQuery}
              onChangeText={setFriendQuery}
            />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.friendListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {friendTabIdx === 0 ? (
              filteredFriends.length > 0 ? (
                filteredFriends.map((f) => (
                  <FriendRow
                    key={f.id}
                    friend={f}
                    selectable
                    selected={selectedIds.has(f.id)}
                    onPress={() => toggleFriend(f.id)}
                  />
                ))
              ) : (
                <HText variant="label" color={colors.textMuted} style={styles.emptyText}>
                  Aucun ami trouvé
                </HText>
              )
            ) : (
              <HText variant="label" color={colors.textMuted} style={styles.emptyText}>
                Bientôt disponible
              </HText>
            )}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <HButton
              variant="primary"
              label="SUIVANT"
              size="full"
              disabled={selectedIds.size === 0}
              onPress={() => setStep(3)}
            />
          </View>
        </>
      )}

      {/* ── STEP 3: Review + Send ── */}
      {step === 3 && (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.stepContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <HHonkRecapCard
              gameName={selectedGame?.name ?? ''}
              recipients={selectedFriends.map((f) => f.name.split(' ')[0])}
            />

            {/* Message */}
            <View style={styles.messageSection}>
              <HText variant="label" color={colors.textLabel} style={styles.sectionLabel}>
                MESSAGE (OPTIONNEL)
              </HText>
              <TextInput
                style={styles.messageInput}
                placeholder="Ajouter un message"
                placeholderTextColor={colors.textMuted}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Expiration */}
            <View style={styles.expirySection}>
              <HText variant="label" color={colors.textLabel} style={styles.sectionLabel}>
                EXPIRATION
              </HText>
              <HSegmentedControl
                tabs={EXPIRY_TABS}
                activeIndex={expiryIdx}
                onSelect={setExpiryIdx}
              />
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
            <HButton
              variant="primary"
              label="ENVOYER LE HONK"
              size="full"
              onPress={() => setStep(4)}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },

  stepContent: {
    padding:       spacing.xl,
    paddingBottom: 24,
    gap:           spacing.xl,
  },

  section: { gap: spacing.md },

  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           12,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop:        spacing.xl,
    backgroundColor:   colors.bg,
    borderTopWidth:    1,
    borderTopColor:    colors.border,
  },

  // Step 2
  step2Fixed: {
    paddingHorizontal: spacing.xl,
    paddingTop:        spacing.lg,
    gap:               spacing.lg,
    paddingBottom:     spacing.sm,
  },
  friendListContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical:   spacing.md,
    gap:               spacing.sm,
  },
  emptyText: { textAlign: 'center', paddingTop: spacing.xxl },

  // Step 3
  messageSection: { gap: spacing.sm },
  sectionLabel: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      12,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
    color:         colors.textLabel,
  },
  messageInput: {
    backgroundColor: colors.bg,
    borderWidth:     1,
    borderColor:     colors.border,
    borderRadius:    8,
    paddingHorizontal: 17,
    paddingTop:      17,
    paddingBottom:   65,
    fontFamily:      'Syne_400Regular',
    fontSize:        16,
    color:           colors.textPrimary,
    lineHeight:      24,
  },
  expirySection: { gap: spacing.sm },

  divider: { height: 1, backgroundColor: colors.border },

  // Step 4 Confirmation
  confirmRoot: { justifyContent: 'center' },
  confirmContent: {
    paddingHorizontal: spacing.xl,
    gap:               spacing.xl,
    alignItems:        'center',
  },
  badgeWrap: { alignItems: 'center', justifyContent: 'center' },
  badgeGlow: {
    position:        'absolute',
    width:           65,
    height:          65,
    borderRadius:    32.5,
    backgroundColor: colors.accent,
    opacity:         0.2,
    // blur not available natively; glow approximated via shadow
    shadowColor:     colors.accent,
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.8,
    shadowRadius:    20,
    elevation:       10,
  },
  badge: {
    width:           65,
    height:          65,
    borderRadius:    74 / 2,
    borderWidth:     2,
    borderColor:     colors.accent,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: colors.bg,
    overflow:        'hidden',
  },
  confirmTitles: { alignItems: 'center', gap: spacing.sm },
  confirmTitle: {
    fontFamily:    'Syne_800ExtraBold',
    fontSize:      32,
    letterSpacing: -1.6,
    textTransform: 'uppercase',
    textAlign:     'center',
    lineHeight:    38,
  },
  confirmSub: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      12,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
    textAlign:     'center',
    color:         colors.textMuted,
  },
  confirmCard: {
    width:           '100%',
    backgroundColor: '#292931',
    borderRadius:    8,
    borderWidth:     1,
    borderColor:     colors.border,
    paddingHorizontal: 17,
    paddingTop:      33,
    paddingBottom:   17,
    gap:             spacing.lg,
    overflow:        'hidden',
  },
  confirmCardAccent: {
    position:        'absolute',
    top:             0,
    right:           0,
    width:           128,
    height:          128,
    borderRadius:    9999,
    backgroundColor: colors.accent,
    opacity:         0.25,
    transform:       [{ translateX: 64 }, { translateY: -64 }],
  },
  confirmGameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
  },
  confirmGameBadge: {
    width:           48,
    height:          48,
    borderRadius:    4,
    backgroundColor: colors.surfaceAlt,
    borderWidth:     1,
    borderColor:     colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  confirmGameInfo: { flex: 1, gap: 4 },
  confirmGameName: {
    fontFamily: 'Syne_700Bold',
    fontSize:   22,
  },
  confirmExpiry: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  expiryDot:     { width: 8, height: 8, borderRadius: 4 },
  confirmExpiryText: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      12,
    letterSpacing: 0.24,
    color:         colors.accent,
  },
  confirmRecipients: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.xs,
  },
});
