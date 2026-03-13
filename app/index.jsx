import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../src/theme';

const getFirebaseAuth = () => {
  if (Platform.OS === 'web') return null;
  try {
    // Use dynamic require so the module isn't evaluated on web.
    // eslint-disable-next-line global-require
    return require('@react-native-firebase/auth').default;
  } catch {
    return null;
  }
};

export default function Index() {
  const [authResolved, setAuthResolved] = useState(Platform.OS === 'web');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();

    if (!firebaseAuth) {
      setIsSignedIn(false);
      setAuthResolved(true);
      return () => {};
    }

    const unsubscribe = firebaseAuth().onAuthStateChanged((user) => {
      setIsSignedIn(Boolean(user));
      setAuthResolved(true);
    });
    return unsubscribe;
  }, []);

  if (authResolved) {
    return <Redirect href={isSignedIn ? '/(tabs)/dashboard' : '/(auth)/onboarding'} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
