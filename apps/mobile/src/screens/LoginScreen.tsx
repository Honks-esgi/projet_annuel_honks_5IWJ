import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthHeader } from '../components/molecules/AuthHeader';
import { HButton } from '../components/atoms/HButton';
import { HDivider } from '../components/atoms/HDivider';
import { HOAuthButton } from '../components/atoms/HOAuthButton';
import { HText } from '../components/atoms/HText';
import { HTextInput } from '../components/atoms/HTextInput';
import { colors, spacing } from '../design/tokens';
import { LoginFormData, loginSchema } from '../lib/validation';
import mockData from '../data/mock.json';
import { getAuthUser } from '../data/helpers';
import { useAuthStore } from '../store/auth';

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const { login } = useAuthStore();

  const onSubmit = async (data: LoginFormData) => {
    if (
      data.email    === mockData.testCredentials.email &&
      data.password === mockData.testCredentials.password
    ) {
      login(getAuthUser());
      router.replace('/(app)' as any);
    } else {
      setError('email', { message: 'Identifiants incorrects' });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader subtitle="Qui est dispo ce soir ?" />

        {/* DEV — mock credentials: test@honks.app / honks123 */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <HTextInput
                label="EMAIL"
                placeholder="toto@mail.fr"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <HTextInput
                label="MOT DE PASSE"
                placeholder="Ton mot de passe"
                secureTextEntry
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity onPress={() => {}} style={styles.forgotLink}>
            <HText variant="body" color={colors.accent}>
              Mot de passe oublié ?
            </HText>
          </TouchableOpacity>

          <HButton
            variant="primary"
            label="SE CONNECTER"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
        </View>

        <View style={styles.divider}>
          <HDivider label="OU CONTINUER AVEC" />
        </View>

        <View style={styles.oauthRow}>
          <HOAuthButton provider="google"  onPress={() => {}} />
          <HOAuthButton provider="discord" onPress={() => {}} />
        </View>

        <View style={styles.footer}>
          <HText variant="body" color={colors.textMuted}>
            Pas encore de compte ?{' '}
          </HText>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <HText variant="body" color={colors.accent}>
              Inscription
            </HText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  form:      { gap: spacing.lg, paddingBottom: spacing.lg },
  forgotLink: { alignSelf: 'flex-end' },
  divider:   { paddingVertical: spacing.xl },
  oauthRow:  { flexDirection: 'row', gap: spacing.md },
  footer: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    paddingTop:     spacing.xxl,
    flexWrap:       'wrap',
  },
});
