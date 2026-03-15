import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Card, Divider, Switch, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAppStore from '../../src/store';
import { signOut } from '../../src/firebase';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const userSettings = useAppStore((s) => s.userSettings);
  const setUserSettings = useAppStore((s) => s.setUserSettings);

  const [highMethaneAlerts, setHighMethaneAlerts] = useState(true);
  const [collectionNotifications, setCollectionNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (_) {}
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Card style={styles.card} contentStyle={styles.cardContent}>
        <Text style={styles.cardTitle}>Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>High methane alerts</Text>
          </View>
          <Switch value={highMethaneAlerts} onValueChange={setHighMethaneAlerts} color={colors.primary} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="atom-variant" size={18} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Gas collection notifications</Text>
          </View>
          <Switch value={collectionNotifications} onValueChange={setCollectionNotifications} color={colors.primary} />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="email-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.settingLabel}>Email reports</Text>
          </View>
          <Switch value={emailReports} onValueChange={setEmailReports} color={colors.primary} />
        </View>
      </Card>

      <Card style={styles.card} contentStyle={styles.cardContent}>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.accountText}>
          Logged in as <Text style={styles.accountEmphasis}>{user?.email ?? 'unknown'}</Text>
        </Text>

        <Button
          mode="outlined"
          onPress={handleSignOut}
          textColor={colors.textPrimary}
          style={styles.signOutButton}
          theme={{ colors: { outline: colors.border } }}
        >
          Sign Out
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  title: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary, marginBottom: spacing.lg },

  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  cardContent: { padding: spacing.lg },
  cardTitle: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, marginBottom: spacing.sm },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1, paddingRight: spacing.sm },
  settingLabel: { fontSize: typography.fontSizeMD, color: colors.textPrimary, flex: 1 },
  divider: { backgroundColor: colors.border },

  accountText: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginBottom: spacing.md },
  accountEmphasis: { color: colors.textPrimary, fontWeight: typography.fontWeightSemiBold },
  signOutButton: { borderRadius: borderRadius.full },
});
