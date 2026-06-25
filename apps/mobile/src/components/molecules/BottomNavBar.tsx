import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';

type Tab = 'home' | 'friends' | 'games' | 'honks' | 'settings';

type TabConfig = {
  key:        Tab;
  label:      string;
  icon:       React.ComponentProps<typeof Ionicons>['name'];
  iconActive: React.ComponentProps<typeof Ionicons>['name'];
};

const TABS: TabConfig[] = [
  { key: 'home',     label: 'HOME',  icon: 'home-outline',            iconActive: 'home' },
  { key: 'friends',  label: 'AMIS',  icon: 'people-outline',          iconActive: 'people' },
  { key: 'games',    label: 'JEUX',  icon: 'game-controller-outline', iconActive: 'game-controller' },
  { key: 'honks',    label: 'HONKS', icon: 'megaphone-outline',       iconActive: 'megaphone' },
  { key: 'settings', label: 'PARAMS',icon: 'settings-outline',        iconActive: 'settings' },
];

const TAB_ROUTES: Record<Tab, string> = {
  home:     '/(app)',
  friends:  '/(app)/friends',
  games:    '/(app)/games',
  honks:    '/(app)/honks',
  settings: '/(app)/settings',
};

type Props = { activeTab: Tab; honkBadge?: number; onTabPress?: (tab: Tab) => void };

export function BottomNavBar({ activeTab, honkBadge = 0, onTabPress }: Props) {
  const insets = useSafeAreaInsets();

  const handlePress = (tab: Tab) => {
    onTabPress?.(tab);
    if (!onTabPress) router.replace(TAB_ROUTES[tab] as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || spacing.sm }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? colors.accent : colors.textLabel;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => handlePress(tab.key)}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={color}
              />
              {tab.key === 'honks' && honkBadge > 0 && (
                <View style={styles.badge}>
                  <HText variant="caption" color={colors.textOnAccent} style={styles.badgeText}>
                    {honkBadge}
                  </HText>
                </View>
              )}
            </View>
            <HText variant="navLabel" color={color} style={styles.tabLabel}>{tab.label}</HText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    backgroundColor:   colors.bg,
    borderTopWidth:    1,
    borderTopColor:    colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.sm,
    alignItems:        'center',
  },
  tab: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap:             4,
  },
  tabActive: {
    backgroundColor: colors.accentSubtle,
    borderRadius:    8,
  },
  iconWrap: { position: 'relative' },
  badge: {
    position:        'absolute',
    top:             -4,
    right:           -8,
    width:           14,
    height:          14,
    borderRadius:    7,
    backgroundColor: colors.accent,
    borderWidth:     1,
    borderColor:     colors.bg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  badgeText: { fontSize: 9, lineHeight: 9 },
  tabLabel:  { fontSize: 10, letterSpacing: 0.5 },
});
