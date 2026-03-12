jsximport { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { signOut } from '../../src/services/auth.service';
import useAppStore from '../../src/store/useAppStore';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const userSettings = useAppStore((s) => s.userSettings);
  const setUserSettings = useAppStore((s) => s.setUserSettings);

  const [notifications, setNotifications] = useState(userSettings.notificationsEnabled);
  const [threshold, setThreshold] = useState(String(userSettings.thresholdPPM));
  const [saving, setSaving] = useState(false);

  const handleSaveThreshold = async () => {
    const parsed = parseInt(threshold);
    if (isNaN(parsed) || parsed < 100 || parsed > 5000) {
      return Alert.alert('Invalid', 'Threshold must be between 100 and 5000 PPM');
    }
    setSaving(true);
    try {
      await firestore().collection('users').doc(user.uid).update({ thresholdPPM: parsed });
      setUserSettings({ thresholdPPM: parsed });
      Alert.alert('Saved', 'Threshold updated');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotifications = async (value) => {
    setNotifications(value);
    try {
      await firestore().collection('users').doc(user.uid).update({ notificationsEnabled: value });
      setUserSettings({ notificationsEnabled: value });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.displayName?.[0]?.toUpperCase() ?? 'U'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.displayName ?? 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Threshold</Text>
        <Text style={styles.sectionDesc}>Alert triggers when CH₄ exceeds this value (PPM)</Text>
        <View style={styles.thresholdRow}>
          <TextInput
            style={styles.thresholdInput}
            value={threshold}
            onChangeText={setThreshold}
            keyboardType="numeric"
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveThreshold} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  section: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textSecondary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  sectionDesc: { fontSize: typography.fontSizeXS, color: colors.textMuted, marginBottom: spacing.sm },
  profileCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightBold, color: '#000' },
  profileName: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  profileEmail: { fontSize: typography.fontSizeSM, color: colors.textSecondary },
  row: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  rowLabel: { fontSize: typography.fontSizeMD, color: colors.textPrimary },
  thresholdRow: { flexDirection: 'row', gap: spacing.sm },
  thresholdInput: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, fontSize: typography.fontSizeMD },
  saveButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md, justifyContent: 'center' },
  saveButtonText: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightBold, color: '#000' },
  signOutButton: { backgroundColor: colors.danger + '22', borderWidth: 1, borderColor: colors.danger, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center' },
  signOutText: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightSemiBold, color: colors.danger },
});
