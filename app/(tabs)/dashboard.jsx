import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, RefreshControl } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { dustbins, alerts, getStatus, statusLabel } from '../../src/data/mockData';

const statusMeta = {
  normal: { color: colors.safe, icon: 'check-circle-outline' },
  medium: { color: colors.warning, icon: 'alert-outline' },
  high: { color: colors.danger, icon: 'alert-circle-outline' },
  collection: { color: colors.primary, icon: 'atom-variant' },
};

function StatCard({ label, value, iconName }) {
  return (
    <View style={styles.statCardWrap}>
      <Card style={styles.statCard} contentStyle={styles.statCardContent}>
        <View style={styles.statIcon}>
          <MaterialCommunityIcons name={iconName} size={20} color={colors.primary} />
        </View>
        <View style={styles.statTextBlock}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
      </Card>
    </View>
  );
}

function BinCard({ bin, onPress }) {
  const status = getStatus(bin);
  const meta = statusMeta[status] ?? { color: colors.textSecondary, icon: 'help-circle-outline' };

  return (
    <View style={styles.binCardWrap}>
      <Pressable onPress={onPress}>
        <Card style={styles.binCard} contentStyle={styles.binCardContent}>
          <View style={styles.binHeader}>
            <Text style={styles.binTitle}>Bin #{bin.id}</Text>
            <View style={[styles.statusPill, { borderColor: meta.color }]}>
              <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
              <Text style={[styles.statusPillText, { color: meta.color }]} numberOfLines={1}>
                {statusLabel[status]}
              </Text>
            </View>
          </View>

          <Text style={styles.binLocation} numberOfLines={1}>
            {bin.location}
          </Text>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <MaterialCommunityIcons name="weather-windy" size={16} color={colors.textSecondary} />
              <Text style={styles.metricLabel}>CH₄</Text>
              <Text style={styles.metricValue}>{bin.methane_ppm}</Text>
            </View>
            <View style={styles.metric}>
              <MaterialCommunityIcons name="thermometer" size={16} color={colors.textSecondary} />
              <Text style={styles.metricLabel}>Temp</Text>
              <Text style={styles.metricValue}>{bin.temperature}°C</Text>
            </View>
            <View style={styles.metric}>
              <MaterialCommunityIcons name="water-percent" size={16} color={colors.textSecondary} />
              <Text style={styles.metricLabel}>RH</Text>
              <Text style={styles.metricValue}>{bin.humidity}%</Text>
            </View>
          </View>

          <View style={styles.binFooter}>
            <MaterialCommunityIcons name={meta.icon} size={14} color={colors.textSecondary} />
            <Text style={styles.binFooterText} numberOfLines={1}>
              Pump: {bin.pump_status} · Valve: {bin.valve_status}
            </Text>
          </View>
        </Card>
      </Pressable>
    </View>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => {
    const totalGas = dustbins.reduce((s, b) => s + b.gas_collected_liters, 0);
    const methaneToday = dustbins.reduce((s, b) => s + b.methane_ppm, 0);
    const activeAlerts = alerts.filter((a) => a.severity === 'high' || a.severity === 'critical').length;

    return [
      { label: 'Total Dustbins', value: String(dustbins.length), iconName: 'delete-outline' },
      { label: 'Methane Detected', value: `${methaneToday} ppm`, iconName: 'weather-windy' },
      { label: 'Gas Collected', value: `${totalGas.toFixed(1)} L`, iconName: 'fire' },
      { label: 'Active Alerts', value: String(activeAlerts), iconName: 'alert-outline' },
    ];
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 750);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <Text style={styles.pageTitle}>Dashboard</Text>

      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} iconName={s.iconName} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Smart Dustbins</Text>

      <FlatList
        data={dustbins}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.binColumnWrap}
        renderItem={({ item }) => (
          <BinCard
            bin={item}
            onPress={() => router.push(`/(tabs)/bin/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.binListContent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: spacing.xl, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary, marginBottom: spacing.lg },
  sectionTitle: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -spacing.xs, marginBottom: spacing.md },
  statCardWrap: { width: '50%', padding: spacing.xs },
  statCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  statCardContent: { padding: spacing.md, flexDirection: 'row', alignItems: 'center', minHeight: 72 },
  statIcon: { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  statTextBlock: { flex: 1 },
  statLabel: { fontSize: typography.fontSizeXS, color: colors.textSecondary, marginBottom: spacing.xs, flexWrap: 'wrap' },
  statValue: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  binListContent: { paddingTop: spacing.xs },
  binColumnWrap: { gap: spacing.sm },
  binCardWrap: { flex: 1, marginBottom: spacing.sm },
  binCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  binCardContent: { padding: spacing.md },
  binHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  binTitle: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, flexShrink: 0 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xs, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, flexShrink: 1, maxWidth: '65%', overflow: 'hidden' },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 3, flexShrink: 0 },
  statusPillText: { fontSize: 9, fontWeight: typography.fontWeightSemiBold, flexShrink: 1 },
  binLocation: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: typography.fontSizeXS, color: colors.textSecondary, marginTop: spacing.xs },
  metricValue: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightBold, color: colors.textPrimary, marginTop: spacing.xs },
  binFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  binFooterText: { flex: 1, fontSize: typography.fontSizeXS, color: colors.textSecondary },
});