jsximport { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';
import useSensorData from '../../src/hooks/useSensorData';
import useAppStore from '../../src/store/useAppStore';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { METHANE_THRESHOLDS } from '../../src/constants/thresholds';
import { format } from 'date-fns';

const getStatusColor = (ppm) => {
  if (!ppm) return colors.textMuted;
  if (ppm < METHANE_THRESHOLDS.SAFE) return colors.safe;
  if (ppm < METHANE_THRESHOLDS.WARNING) return colors.warning;
  return colors.danger;
};

const getStatusLabel = (ppm) => {
  if (!ppm) return 'No Data';
  if (ppm < METHANE_THRESHOLDS.SAFE) return 'Safe';
  if (ppm < METHANE_THRESHOLDS.WARNING) return 'Elevated';
  return 'Danger';
};

export default function Dashboard() {
  const { latestReading, sensorStatus } = useSensorData();
  const user = useAppStore((s) => s.user);
  const [refreshing, setRefreshing] = useState(false);

  const ppm = latestReading?.ppm ?? null;
  const statusColor = getStatusColor(ppm);
  const statusLabel = getStatusLabel(ppm);
  const lastUpdated = latestReading?.timestamp
    ? format(new Date(latestReading.timestamp), 'MMM d, HH:mm:ss')
    : 'Never';

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.displayName?.split(' ')[0] ?? 'User'} 👋</Text>
        <Text style={styles.subtitle}>BioHarvest Monitor</Text>
      </View>

      <View style={[styles.mainCard, { borderColor: statusColor }]}>
        <Text style={styles.mainCardLabel}>CH₄ Concentration</Text>
        <Text style={[styles.ppmValue, { color: statusColor }]}>
          {ppm !== null ? ppm.toFixed(1) : '--'}
        </Text>
        <Text style={styles.ppmUnit}>PPM</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Sensor</Text>
          <Text style={[styles.infoValue, { color: sensorStatus === 'active' ? colors.safe : colors.danger }]}>
            {sensorStatus === 'active' ? '● Online' : '● Offline'}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Last Update</Text>
          <Text style={styles.infoValue}>{lastUpdated}</Text>
        </View>
      </View>

      <View style={styles.thresholdCard}>
        <Text style={styles.thresholdTitle}>Thresholds</Text>
        <View style={styles.thresholdRow}>
          <View style={[styles.thresholdDot, { backgroundColor: colors.safe }]} />
          <Text style={styles.thresholdText}>Safe — below {METHANE_THRESHOLDS.SAFE} PPM</Text>
        </View>
        <View style={styles.thresholdRow}>
          <View style={[styles.thresholdDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.thresholdText}>Elevated — {METHANE_THRESHOLDS.SAFE}–{METHANE_THRESHOLDS.WARNING} PPM</Text>
        </View>
        <View style={styles.thresholdRow}>
          <View style={[styles.thresholdDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.thresholdText}>Danger — above {METHANE_THRESHOLDS.WARNING} PPM</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  greeting: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  subtitle: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
  mainCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
  },
  mainCardLabel: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginBottom: spacing.sm },
  ppmValue: { fontSize: 72, fontWeight: typography.fontWeightBold, lineHeight: 80 },
  ppmUnit: { fontSize: typography.fontSizeLG, color: colors.textSecondary, marginTop: spacing.xs },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, marginTop: spacing.md },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
  statusText: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold },
  row: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.sm },
  infoCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  infoLabel: { fontSize: typography.fontSizeXS, color: colors.textMuted, marginBottom: spacing.xs },
  infoValue: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  thresholdCard: { margin: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  thresholdTitle: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, marginBottom: spacing.md },
  thresholdRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  thresholdDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  thresholdText: { fontSize: typography.fontSizeSM, color: colors.textSecondary },
});
