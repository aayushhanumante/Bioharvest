jsximport { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../src/theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Monitor Methane',
    description: 'Real-time CH₄ concentration monitoring from your waste bins using MQ4 sensors.',
    emoji: '🌿',
  },
  {
    title: 'Smart Alerts',
    description: 'Get instant notifications when methane levels exceed safe thresholds.',
    emoji: '⚡',
  },
  {
    title: 'Analytics & Insights',
    description: 'Visualize trends and understand the energy potential of collected methane.',
    emoji: '📊',
  },
];

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>BioHarvest</Text>
        <Text style={styles.logoSub}>Smart CH₄ Collection System</Text>
      </View>

      <View style={styles.slides}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.emoji}>{slide.emoji}</Text>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDesc}>{slide.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  header: { paddingTop: 80, alignItems: 'center', marginBottom: spacing.xl },
  logo: { fontSize: typography.fontSizeXXL, fontWeight: typography.fontWeightBold, color: colors.primary },
  logoSub: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
  slides: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  slide: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: { fontSize: 36, marginBottom: spacing.sm },
  slideTitle: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, marginBottom: spacing.xs },
  slideDesc: { fontSize: typography.fontSizeSM, color: colors.textSecondary, lineHeight: 20 },
  footer: { paddingBottom: 48 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  buttonText: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightBold, color: '#000' },
});
