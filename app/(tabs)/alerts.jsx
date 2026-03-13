import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { format } from 'date-fns';
import { alerts } from '../../src/data/mockData';

export default function Alerts() {
  const severityConfig = {
    low: { icon: 'information-outline', color: colors.safe, bg: colors.safe + '1A', label: 'Low' },
    medium: { icon: 'alert-outline', color: colors.warning, bg: colors.warning + '1A', label: 'Medium' },
    high: { icon: 'alert-circle-outline', color: colors.danger, bg: colors.danger + '1A', label: 'High' },
    critical: { icon: 'shield-alert-outline', color: colors.danger, bg: colors.danger + '1A', label: 'Critical' },
  };

  const renderAlert = ({ item }) => {
    const cfg = severityConfig[item.severity] ?? severityConfig.low;
    const time = item.timestamp ? format(new Date(item.timestamp), 'MMM d, yyyy • HH:mm') : 'Unknown time';

    return (
      <Card style={styles.card} contentStyle={styles.cardContent}>
        <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
          <MaterialCommunityIcons name={cfg.icon} size={22} color={cfg.color} />
        </View>

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
            <View style={[styles.badge, { borderColor: colors.border }]}>
              <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{cfg.label}</Text>
            </View>
          </View>
          <Text style={styles.meta} numberOfLines={1}>
            Bin #{item.bin_id} · {time}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <Text style={styles.subtitle}>{alerts.length} total</Text>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="check-circle-outline" size={48} color={colors.safe} />
          <Text style={styles.emptyText}>No alerts</Text>
          <Text style={styles.emptySubtext}>Methane levels are within safe limits</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => String(item.id)}
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
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm },

  card: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  cardContent: { padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  textBlock: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm },
  message: { flex: 1, fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  badge: { borderWidth: 1, borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeText: { fontSize: typography.fontSizeXS, fontWeight: typography.fontWeightMedium },
  meta: { fontSize: typography.fontSizeXS, color: colors.textSecondary, marginTop: spacing.xs },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: typography.fontSizeLG, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary },
  emptySubtext: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
});
