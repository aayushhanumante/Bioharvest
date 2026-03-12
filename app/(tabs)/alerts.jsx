jsximport { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAlerts from '../../src/hooks/useAlerts';
import { resolveAlert } from '../../src/services/sensor.service';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { format } from 'date-fns';

export default function Alerts() {
  const { alerts } = useAlerts();

  const handleResolve = async (id) => {
    try {
      await resolveAlert(id);
    } catch (e) {
      console.error(e);
    }
  };

  const renderAlert = ({ item }) => {
    const time = item.triggeredAt?.toDate
      ? format(item.triggeredAt.toDate(), 'MMM d, HH:mm')
      : 'Unknown time';

    return (
      <View style={[styles.alertCard, item.resolved && styles.alertResolved]}>
        <View style={styles.alertLeft}>
          <Text style={styles.alertEmoji}>{item.resolved ? '✅' : '⚠️'}</Text>
        </View>
        <View style={styles.alertContent}>
          <Text style={styles.alertTitle}>{item.resolved ? 'Resolved' : 'High Methane Detected'}</Text>
          <Text style={styles.alertPPM}>{item.ppm?.toFixed(1)} PPM — {item.binId}</Text>
          <Text style={styles.alertTime}>{time}</Text>
        </View>
        {!item.resolved && (
          <TouchableOpacity style={styles.resolveButton} onPress={() => handleResolve(item.id)}>
            <Text style={styles.resolveText}>Resolve</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>{alerts.filter(a => !a.resolved).length} active</Text>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>✅</Text>
          <Text style={styles.emptyText}>No alerts</Text>
          <Text style={styles.emptySubtext}>Methane levels are within safe limits</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderAlert}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  subtitle: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.danger + '66',
  },
  alertResolved: { borderColor: colors.border, opacity: 0.6 },
  alertLeft: { marginRight: spacing.sm },
  alertEmoji: { fontSize: 24 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  alertPPM: { fontSize: typography.fontSizeXS, color: colors.textSecondary, marginTop: 2 },
  alertTime: { fontSize: typography.fontSizeXS, color: colors.textMuted, marginTop: 2 },
  resolveButton: { backgroundColor: colors.primary + '22', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  resolveText: { fontSize: typography.fontSizeXS, color: colors.primary, fontWeight: typography.fontWeightSemiBold },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  emptySubtext: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
});
