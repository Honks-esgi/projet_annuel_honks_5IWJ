import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthHeader } from '../components/molecules/AuthHeader';
import { HButton } from '../components/atoms/HButton';
import { HText } from '../components/atoms/HText';
import { HTextInput } from '../components/atoms/HTextInput';
import { colors, spacing } from '../design/tokens';
import { RegisterFormData, registerSchema } from '../lib/validation';

export function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (_data: RegisterFormData) => {
    // TODO: wire to auth API
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader subtitle="Créer un compte" />

        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <HTextInput
                label="USERNAME"
                placeholder="Ton pseudo"
                autoCapitalize="none"
                autoComplete="username"
                value={value}
                onChangeText={onChange}
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <HTextInput
                label="EMAIL"
                placeholder="Ton adresse email"
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
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <HTextInput
                label="CONFIRMER LE MOT DE PASSE"
                placeholder="Confirme ton mot de passe"
                secureTextEntry
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <HButton
            variant="primary"
            label="CRÉER MON COMPTE"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
          />
        </View>

        <View style={styles.footer}>
          <HText variant="body" color={colors.textMuted}>
            Déjà un compte ?{' '}
          </HText>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <TouchableOpacity onPress={() => router.replace('/(auth)' as any)}>
            <HText variant="body" color={colors.accent}>
              Connexion
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
  form:      { gap: spacing.lg, paddingBottom: spacing.xxl },
  footer: {
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems:     'center',
    paddingTop:     spacing.sm,
    flexWrap:       'wrap',
  },
});
