import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { dustbins, methaneChartData, gasCollectionData, getStatus, statusLabel } from '../../../src/mockData';
import { colors, typography, spacing, borderRadius } from '../../../src/theme';

const statusMeta = {
  normal: { color: colors.safe },
  medium: { color: colors.warning },
  high: { color: colors.danger },
  collection: { color: colors.primary },
};

export default function BinDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const bin = dustbins.find((b) => b.id === Number(id));

  if (!bin) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Bin not found.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={16} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const status = getStatus(bin);
  const meta = statusMeta[status] ?? { color: colors.textSecondary };

  const metrics = [
    { label: 'Methane', value: `${bin.methane_ppm} ppm`, icon: 'weather-windy' },
    { label: 'Temperature', value: `${bin.temperature}°C`, icon: 'thermometer' },
    { label: 'Humidity', value: `${bin.humidity}%`, icon: 'water-percent' },
    { label: 'Gas Collected', value: `${bin.gas_collected_liters} L`, icon: 'fire' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Bin #{bin.id}</Text>
          <Text style={styles.location}>{bin.location}</Text>
        </View>
        <View style={[styles.statusPill, { borderColor: meta.color }]}>
          <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
          <Text style={[styles.statusText, { color: meta.color }]}>{statusLabel[status]}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        {metrics.map((m) => (
          <Card key={m.label} style={styles.metricCard} contentStyle={styles.metricCardContent}>
            <View style={styles.metricIcon}>
              <MaterialCommunityIcons name={m.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricLabel}>{m.label}</Text>
            <Text style={styles.metricValue}>{m.value}</Text>
          </Card>
        ))}
      </View>

      <Card style={styles.infoCard} contentStyle={styles.infoCardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pump Status</Text>
          <Text style={[styles.infoValue, { color: bin.pump_status === 'ON' ? colors.primary : colors.textSecondary }]}>{bin.pump_status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Valve Status</Text>
          <Text style={[styles.infoValue, { color: bin.valve_status === 'OPEN' ? colors.primary : colors.textSecondary }]}>{bin.valve_status}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Update</Text>
          <Text style={styles.infoValue}>{new Date(bin.last_update).toLocaleString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Coordinates</Text>
          <Text style={styles.infoValue}>{bin.lat}, {bin.lng}</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.sm },
  backBtn: { padding: spacing.xs },
  headerText: { flex: 1 },
  title: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  location: { fontSize: typography.fontSizeSM, color: colors.textSecondary },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  statusText: { fontSize: typography.fontSizeXS, fontWeight: typography.fontWeightSemiBold },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm },
  metricCard: { width: '47%', backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  metricCardContent: { padding: spacing.md },
  metricIcon: { width: 36, height: 36, borderRadius: borderRadius.sm, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  metricLabel: { fontSize: typography.fontSizeXS, color: colors.textSecondary },
  metricValue: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightBold, color: colors.textPrimary, marginTop: spacing.xs },
  infoCard: { marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  infoCardContent: { padding: spacing.lg },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: typography.fontSizeSM, color: colors.textSecondary },
  infoValue: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  notFound: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: typography.fontSizeMD, color: colors.textSecondary, marginBottom: spacing.md },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full },
  backText: { color: colors.primary, fontSize: typography.fontSizeSM },
});