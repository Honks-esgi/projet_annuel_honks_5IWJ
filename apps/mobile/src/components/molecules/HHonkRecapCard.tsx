import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../design/tokens';
import { HText } from '../atoms/HText';
import { HRecipientTag } from '../atoms/HRecipientTag';

type Props = {
  gameName:   string;
  recipients: string[]; // usernames (without @)
};

export function HHonkRecapCard({ gameName, recipients }: Props) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['rgba(255,230,0,0.082)', 'transparent']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <HText variant="label" color={colors.textLabel} style={styles.recapLabel}>RÉCAP</HText>

      {/* Game row */}
      <View style={styles.gameRow}>
        <Ionicons name="game-controller-outline" size={22} color={colors.textLabel} />
        <HText variant="body" color={colors.textPrimary} style={styles.gameName}>
          {gameName}
        </HText>
      </View>

      <View style={styles.divider} />

      <HText variant="label" color={colors.textLabel} style={styles.destLabel}>DESTINATAIRES</HText>

      {/* Recipient tags */}
      <View style={styles.tags}>
        {recipients.map((username) => (
          <HRecipientTag key={username} variant="selected" username={username} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     colors.border,
    padding:         17,
    gap:             spacing.sm,
    overflow:        'hidden',
  },
  recapLabel: {
    fontFamily:    'IBMPlexMono_600SemiBold',
    fontSize:      14,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color:         colors.textLabel,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
    paddingBottom: spacing.sm,
  },
  gameName: {
    fontFamily: 'Syne_700Bold',
    fontSize:   18,
    letterSpacing: 0.45,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
  },
  destLabel: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      12,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
    color:         colors.textLabel,
    paddingTop:    spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.lg,
    paddingTop:    spacing.xs,
  },
});
