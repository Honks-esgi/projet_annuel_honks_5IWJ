import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/auth';
import { colors } from '../../src/design/tokens';

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Redirect href={'/(app)' as any} />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
  );
}
