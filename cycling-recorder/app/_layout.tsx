import { Tabs } from 'expo-router';
import { AuthProvider } from './auth/authContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}