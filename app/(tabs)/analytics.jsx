import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useMemo } from 'react';
import { Card } from 'react-native-paper';
import { colors, typography, spacing, borderRadius } from '../../src/theme';
import { methaneChartData, gasCollectionData, dailyMethaneData, efficiencyData } from '../../src/mockData';
import Svg, { Polyline, Rect, Line, Text as SvgText, G } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_W = width - spacing.lg * 4;
const CHART_H = 180;
const PAD = { top: 10, bottom: 30, left: 40, right: 10 };

function normalize(data, key) {
  const vals = data.map(d => d[key]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  return data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * (CHART_W - PAD.left - PAD.right),
    y: PAD.top + (1 - (d[key] - min) / (max - min || 1)) * (CHART_H - PAD.top - PAD.bottom),
    label: d.label ?? d.time ?? d.day ?? d.date ?? d.month ?? '',
    value: d[key],
  }));
}

function LineChart({ data, color }) {
  const points = normalize(data, 'y');
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <Svg width={CHART_W} height={CHART_H}>
      <Line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={CHART_H - PAD.bottom} stroke={colors.border} strokeWidth={1} />
      <Line x1={PAD.left} y1={CHART_H - PAD.bottom} x2={CHART_W - PAD.right} y2={CHART_H - PAD.bottom} stroke={colors.border} strokeWidth={1} />
      <Polyline points={polyPoints} fill="none" stroke={color} strokeWidth={2} />
      {points.map((p, i) => (
        <G key={i}>
          <SvgText x={p.x} y={CHART_H - PAD.bottom + 14} fontSize={8} fill={colors.textSecondary} textAnchor="middle">{p.label}</SvgText>
        </G>
      ))}
    </Svg>
  );
}

function BarChart({ data, color }) {
  const points = normalize(data, 'y');
  const barW = Math.max(4, (CHART_W - PAD.left - PAD.right) / data.length - 4);
  const bottomY = CHART_H - PAD.bottom;
  return (
    <Svg width={CHART_W} height={CHART_H}>
      <Line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={bottomY} stroke={colors.border} strokeWidth={1} />
      <Line x1={PAD.left} y1={bottomY} x2={CHART_W - PAD.right} y2={bottomY} stroke={colors.border} strokeWidth={1} />
      {points.map((p, i) => (
        <G key={i}>
          <Rect x={p.x - barW / 2} y={p.y} width={barW} height={bottomY - p.y} fill={color} rx={3} />
          <SvgText x={p.x} y={CHART_H - PAD.bottom + 14} fontSize={8} fill={colors.textSecondary} textAnchor="middle">{p.label}</SvgText>
        </G>
      ))}
    </Svg>
  );
}

export default function Analytics() {
  const methaneData = useMemo(() => methaneChartData.map(d => ({ y: d.ppm, label: d.time })), []);
  const gasData = useMemo(() => gasCollectionData.map(d => ({ y: d.collected, label: d.day })), []);
  const dailyData = useMemo(() => dailyMethaneData.map(d => ({ y: d.detected, label: d.date.replace('Mar ', '') })), []);
  const effData = useMemo(() => efficiencyData.map(d => ({ y: d.efficiency, label: d.month })), []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Trends and performance</Text>
      </View>

      <Card style={styles.card} contentStyle={styles.cardContent}>
        <Text style={styles.cardTitle}>Methane Production Trends (ppm)</Text>
        <LineChart data={methaneData} color={colors.warning} />
      </Card>

      <Card style={styles.card} contentStyle={styles.cardContent}>
        <Text style={styles.cardTitle}>Gas Collection Trends (L)</Text>
        <BarChart data={gasData} color={colors.primary} />
      </Card>

      <Card style={styles.card} contentStyle={styles.cardContent}>
        <Text style={styles.cardTitle}>Daily Methane Detected (ppm)</Text>
        <LineChart data={dailyData} color={colors.danger} />
      </Card>

      <Card style={styles.card} contentStyle={styles.cardContent}>
        <Text style={styles.cardTitle}>Collection Efficiency (%)</Text>
        <LineChart data={effData} color={colors.primary} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { fontSize: typography.fontSizeXL, fontWeight: typography.fontWeightBold, color: colors.textPrimary },
  subtitle: { fontSize: typography.fontSizeSM, color: colors.textSecondary, marginTop: spacing.xs },
  card: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border },
  cardContent: { padding: spacing.lg },
  cardTitle: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textPrimary, marginBottom: spacing.sm },
});