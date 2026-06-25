import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../src/store/auth';
import { colors } from '../../src/design/tokens';

export default function AppLayout() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Redirect href={'/(auth)' as any} />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
  );
}
