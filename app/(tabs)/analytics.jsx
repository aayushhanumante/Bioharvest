jsximport { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { LineChart, PieChart } from 'victory-native';
import { fetchReadingHistory } from '../../src/services/sensor.service';
import useAppStore from '../../src/store/useAppStore';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const PIE_DATA = [
  { x: 'Cooking', y: 60, color: colors.primary },
  { x: 'Heating', y: 25, color: colors.warning },
  { x: 'Electricity', y: 15, color: '#6C63FF' },
];

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const setReadingHistory = useAppStore((s) => s.setReadingHistory);

  useEffect(() => {
    fetchReadingHistory(50).then((data) => {
      setHistory(data);
      setReadingHistory(data);
      setLoading(false);
    });
  }, []);

  const chartData = history.map((r, i) => ({ x: i, y: r.ppm ?? 0 }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Last 50 readings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>CH₄ Concentration Over Time</Text>
        {loading ? (
          <Text style={styles.loading}>Loading data...</Text>
        ) : history.length === 0 ? (
          <Text style={styles.loading}>No historical data yet</Text>
        ) : (
          <LineChart
            data={chartData}
            width={width - spacing.lg * 2 - spacing.lg * 2}
            height={200}
            style={{ data: { stroke: colors.primary, strokeWidth: 2 } }}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estimated Utilization Potential</Text>
        <Text style={styles.disclaimer}>⚠️ Illustrative model — not derived from live sensor data</Text>
        <PieChart
          data={PIE_DATA}
          width={width - spacing.lg * 2 - spacing.lg * 2}
          height={200}
          colorScale={PIE_DATA.map(d => d.color)}
          innerRadius={60}
          labels={({ datum }) => `${datum.x}\n${datum.y}%`}
          style={{ labels: { fill: colors.textSecondary, fontSize: 10 } }}
        />
        <View style={styles.legend}>
          {PIE_DATA.map((item) => (
            <View key={item.x} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.x} — {item.y}%</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  subtitle: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
  card: { margin: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, marginBottom: spacing.md },
  loading: { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.xl },
  disclaimer: { fontSize: typography.fontSizeXS, color: colors.warning, marginBottom: spacing.md },
  legend: { marginTop: spacing.md, gap: spacing.xs },
  legendRow: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  legendText: { fontSize: typography.fontSizeSM, color: colors.textSecondary },
});
