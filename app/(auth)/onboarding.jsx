import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../src/theme';

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.logo}>BioHarvest</Text>
        <Text style={styles.tagline}>Smart CH₄ Collection System</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingTop: 120, paddingBottom: 60 },
  center: { alignItems: 'center' },
  logo: { fontSize: 48, fontWeight: typography.fontWeightBold, color: colors.primary, letterSpacing: -1 },
  tagline: { fontSize: typography.fontSizeMD, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
  button: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center' },
  buttonText: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightBold, color: '#000' },
});