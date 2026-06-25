import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing } from '../design/tokens';
import { HText } from '../components/atoms/HText';
import { HBadge } from '../components/atoms/HBadge';
import { HSearchInput } from '../components/atoms/HSearchInput';
import { HSectionHeader } from '../components/atoms/HSectionHeader';
import { HScreenHeader } from '../components/molecules/HScreenHeader';
import { GameCard } from '../components/molecules/GameCard';
import { BottomNavBar } from '../components/molecules/BottomNavBar';
import mockData from '../data/mock.json';
import { getGames } from '../data/helpers';

const FILTERS: string[] = mockData.platformFilters;
const ALL_GAMES = getGames();

export function GamesScreen() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [query, setQuery]               = useState('');

  const filtered  = ALL_GAMES.filter((g) =>
    !query || g.name.toLowerCase().includes(query.toLowerCase()),
  );
  const favorites = filtered.filter((g) => g.isFavorite);
  const catalogue = filtered.filter((g) => !g.isFavorite);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HScreenHeader
        title="Jeux"
        right={
          <HBadge variant="pill" label={`${ALL_GAMES.length} JEUX`} />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HSearchInput placeholder="Rechercher un jeu .." value={query} onChangeText={setQuery} />

        {/* Platform filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((f, i) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, i === activeFilter && styles.filterChipActive]}
              onPress={() => setActiveFilter(i)}
            >
              <HText
                variant="navLabel"
                color={i === activeFilter ? colors.textOnAccent : colors.textMuted}
                style={styles.filterLabel}
              >
                {f}
              </HText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <HSectionHeader title="MES FAVORIS" />
          <View style={styles.grid}>
            {favorites.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                onPress={() => router.push({ pathname: '/(app)/honk-wizard', params: { gameId: g.id } })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <HSectionHeader title="CATALOGUE" />
          <View style={styles.grid}>
            {catalogue.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                onPress={() => router.push({ pathname: '/(app)/honk-wizard', params: { gameId: g.id } })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="games" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxl },
  filtersRow:      { gap: spacing.sm, paddingVertical: 2 },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical:   9,
    borderRadius:      9999,
    backgroundColor:   colors.surface,
    borderWidth:       1,
    borderColor:       colors.textMuted,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor:     colors.accent,
  },
  filterLabel: { fontSize: 13 },
  section:     { gap: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.md,
  },
});
