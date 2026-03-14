import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { colors } from '../src/theme';

export default function Index() {
  const [authResolved, setAuthResolved] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setIsSignedIn(Boolean(user));
      setAuthResolved(true);
    });
    return unsubscribe;
  }, []);

  if (!authResolved) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={isSignedIn ? '/(tabs)/dashboard' : '/(auth)/onboarding'} />;
}