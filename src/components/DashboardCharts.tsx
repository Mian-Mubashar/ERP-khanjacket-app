/**
 * Khan Jacket House - Mobile Dashboard Analytics & Charts
 * Interactive Monthly Inward vs Outward Bar Graph, Category Distribution & City Dispatches
 * 100% Native, High-Performance, Light & Dark Mode Themed
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface MonthData {
  month: string;
  inwardPcs: number;
  outwardPcs: number;
  inwardVal: number; // in PKR
  outwardVal: number; // in PKR
}

const MONTHS_DATA: MonthData[] = [
  { month: 'May', inwardPcs: 1800, outwardPcs: 1200, inwardVal: 3870000, outwardVal: 3360000 },
  { month: 'Jun', inwardPcs: 2400, outwardPcs: 1600, inwardVal: 5160000, outwardVal: 4480000 },
  { month: 'Jul', inwardPcs: 3100, outwardPcs: 2200, inwardVal: 6665000, outwardVal: 6160000 },
  { month: 'Aug', inwardPcs: 4200, outwardPcs: 3400, inwardVal: 9030000, outwardVal: 9520000 },
  { month: 'Sep', inwardPcs: 5800, outwardPcs: 4100, inwardVal: 12470000, outwardVal: 11480000 },
  { month: 'Oct', inwardPcs: 6900, outwardPcs: 5200, inwardVal: 14835000, outwardVal: 14560000 },
];

interface CategoryItem {
  name: string;
  stuff: string;
  pcs: number;
  percent: number;
  val: number;
  color: string;
}

const CATEGORY_STATS: CategoryItem[] = [
  { name: 'Down Puffer Jackets', stuff: 'Waterproof Nylon', pcs: 3400, percent: 34, val: 9010000, color: '#2563eb' },
  { name: 'Windbreaker Sport Jackets', stuff: 'Taslan Poly', pcs: 2800, percent: 28, val: 5460000, color: '#8b5cf6' },
  { name: 'Dry-Fit Sports T-Shirts', stuff: 'Micro-Mesh', pcs: 1900, percent: 19, val: 2470000, color: '#10b981' },
  { name: 'Football & Cricket Jerseys', stuff: 'Sublimated', pcs: 1200, percent: 12, val: 1800000, color: '#f59e0b' },
  { name: 'Cargo Trousers & Fleece', stuff: 'Cotton Twill', pcs: 700, percent: 7, val: 1260000, color: '#ec4899' },
];

interface CityItem {
  city: string;
  market: string;
  dispatches: number;
  pcs: number;
  percent: number;
  color: string;
}

const CITY_STATS: CityItem[] = [
  { city: 'Karachi Wholesale', market: 'Bolton & Tariq Rd', dispatches: 32, pcs: 4800, percent: 40, color: '#2563eb' },
  { city: 'Lahore Hub', market: 'Anarkali & Shah Alam', dispatches: 24, pcs: 3200, percent: 27, color: '#8b5cf6' },
  { city: 'Faisalabad Market', market: 'Rail Bazaar Cloth', dispatches: 16, pcs: 2100, percent: 17, color: '#10b981' },
  { city: 'Rawalpindi / Islamabad', market: 'Raja Bazaar Hub', dispatches: 11, pcs: 1200, percent: 10, color: '#f59e0b' },
  { city: 'Peshawar Outlet', market: 'Karkhano Market', dispatches: 7, pcs: 700, percent: 6, color: '#ec4899' },
];

export const DashboardCharts: React.FC = () => {
  const { theme } = useTheme();
  const [metricMode, setMetricMode] = useState<'pieces' | 'value'>('pieces');
  const [selectedIndex, setSelectedIndex] = useState<number>(5); // default latest month (Oct)
  const [distributionTab, setDistributionTab] = useState<'category' | 'city'>('category');

  // Find max for bar scaling
  const maxPcs = Math.max(...MONTHS_DATA.map((d) => Math.max(d.inwardPcs, d.outwardPcs)));
  const maxVal = Math.max(...MONTHS_DATA.map((d) => Math.max(d.inwardVal, d.outwardVal)));
  const currentMax = metricMode === 'pieces' ? maxPcs : maxVal;
  const MAX_BAR_HEIGHT = 120;

  const selectedMonth = MONTHS_DATA[selectedIndex];

  return (
    <View style={styles.container}>
      {/* ------------------------------------------------------------- */}
      {/* CHART 1: INWARD VS OUTWARD BAR CHART */}
      {/* ------------------------------------------------------------- */}
      <View
        style={[
          styles.chartCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        {/* Header with Title and Mode Switcher */}
        <View style={styles.chartHeader}>
          <View style={styles.titleBox}>
            <View style={[styles.badgeIcon, { backgroundColor: theme.brandBlueLight }]}>
              <Text style={[styles.badgeIconText, { color: theme.brandBlue }]}>📈</Text>
            </View>
            <View>
              <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>
                Stock Flow Velocity
              </Text>
              <Text style={[styles.chartSubtitle, { color: theme.textMuted }]}>
                Inward (China) vs Outward (Dispatches)
              </Text>
            </View>
          </View>

          {/* Toggle Button: Pieces vs PKR Value */}
          <View
            style={[
              styles.toggleGroup,
              { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}
          >
            <Pressable
              onPress={() => setMetricMode('pieces')}
              style={[
                styles.toggleBtn,
                metricMode === 'pieces' && {
                  backgroundColor: theme.surface,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                  elevation: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  { color: theme.textMuted },
                  metricMode === 'pieces' && { color: theme.brandBlue, fontWeight: '800' },
                ]}
              >
                Pieces
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setMetricMode('value')}
              style={[
                styles.toggleBtn,
                metricMode === 'value' && {
                  backgroundColor: theme.surface,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                  elevation: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  { color: theme.textMuted },
                  metricMode === 'value' && { color: theme.brandBlue, fontWeight: '800' },
                ]}
              >
                Value (PKR)
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Selected Month Interactive Details Banner */}
        <View
          style={[
            styles.selectedBanner,
            {
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.border,
            },
          ]}
        >
          <View>
            <Text style={[styles.selectedMonthName, { color: theme.brandBlue }]}>
              {selectedMonth.month} Summary
            </Text>
            <Text style={[styles.selectedDetails, { color: theme.textSecondary }]}>
              Inward:{' '}
              <Text style={styles.boldText}>
                {metricMode === 'pieces'
                  ? `${selectedMonth.inwardPcs.toLocaleString()} Pcs`
                  : `Rs. ${(selectedMonth.inwardVal / 1000000).toFixed(2)}M`}
              </Text>{' '}
              • Outward:{' '}
              <Text style={styles.boldText}>
                {metricMode === 'pieces'
                  ? `${selectedMonth.outwardPcs.toLocaleString()} Pcs`
                  : `Rs. ${(selectedMonth.outwardVal / 1000000).toFixed(2)}M`}
              </Text>
            </Text>
          </View>
          <View style={styles.growthBadge}>
            <Text style={styles.growthBadgeText}>
              {metricMode === 'pieces'
                ? `+${(selectedMonth.inwardPcs - selectedMonth.outwardPcs).toLocaleString()} Net`
                : `+Rs. ${((selectedMonth.inwardVal - selectedMonth.outwardVal) / 1000000).toFixed(1)}M`}
            </Text>
          </View>
        </View>

        {/* The Visual Bar Chart Grid */}
        <View style={styles.chartBarsArea}>
          {MONTHS_DATA.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const inValue = metricMode === 'pieces' ? item.inwardPcs : item.inwardVal;
            const outValue = metricMode === 'pieces' ? item.outwardPcs : item.outwardVal;

            const inHeight = Math.max(12, Math.round((inValue / currentMax) * MAX_BAR_HEIGHT));
            const outHeight = Math.max(12, Math.round((outValue / currentMax) * MAX_BAR_HEIGHT));

            return (
              <Pressable
                key={item.month}
                onPress={() => setSelectedIndex(idx)}
                style={[
                  styles.barColumn,
                  isSelected && {
                    backgroundColor: theme.brandBlueLight,
                    borderRadius: 8,
                  },
                ]}
              >
                {/* Bars Container */}
                <View style={[styles.barsWrapper, { height: MAX_BAR_HEIGHT }]}>
                  {/* Inward Bar (Brand Blue) */}
                  <View
                    style={[
                      styles.singleBar,
                      {
                        height: inHeight,
                        backgroundColor: isSelected ? theme.brandBlue : '#60a5fa',
                      },
                    ]}
                  />

                  {/* Outward Bar (Emerald Green / Purple) */}
                  <View
                    style={[
                      styles.singleBar,
                      {
                        height: outHeight,
                        backgroundColor: isSelected ? '#10b981' : '#34d399',
                      },
                    ]}
                  />
                </View>

                {/* Month Label */}
                <Text
                  style={[
                    styles.barLabel,
                    { color: theme.textMuted },
                    isSelected && { color: theme.brandBlue, fontWeight: '800' },
                  ]}
                >
                  {item.month}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Legend */}
        <View style={[styles.legendRow, { borderTopColor: theme.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.brandBlue }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              Inward (Purchases)
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              Outward (Dispatches)
            </Text>
          </View>
        </View>
      </View>

      {/* ------------------------------------------------------------- */}
      {/* CHART 2: CATEGORY & CITY DISTRIBUTION */}
      {/* ------------------------------------------------------------- */}
      <View
        style={[
          styles.chartCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            marginTop: 14,
          },
        ]}
      >
        {/* Header with Tab Switcher */}
        <View style={styles.chartHeader}>
          <View style={styles.titleBox}>
            <View style={[styles.badgeIcon, { backgroundColor: theme.brandBlueLight }]}>
              <Text style={[styles.badgeIconText, { color: theme.brandBlue }]}>📊</Text>
            </View>
            <View>
              <Text style={[styles.chartTitle, { color: theme.textPrimary }]}>
                Inventory Distribution
              </Text>
              <Text style={[styles.chartSubtitle, { color: theme.textMuted }]}>
                Top garment categories & wholesale cities
              </Text>
            </View>
          </View>

          {/* Tab Selector */}
          <View
            style={[
              styles.toggleGroup,
              { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}
          >
            <Pressable
              onPress={() => setDistributionTab('category')}
              style={[
                styles.toggleBtn,
                distributionTab === 'category' && {
                  backgroundColor: theme.surface,
                  elevation: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  { color: theme.textMuted },
                  distributionTab === 'category' && { color: theme.brandBlue, fontWeight: '800' },
                ]}
              >
                Categories
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setDistributionTab('city')}
              style={[
                styles.toggleBtn,
                distributionTab === 'city' && {
                  backgroundColor: theme.surface,
                  elevation: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  { color: theme.textMuted },
                  distributionTab === 'city' && { color: theme.brandBlue, fontWeight: '800' },
                ]}
              >
                Cities
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Distribution Progress Rows */}
        <View style={styles.distributionList}>
          {distributionTab === 'category'
            ? CATEGORY_STATS.map((cat) => (
                <View key={cat.name} style={styles.distRow}>
                  <View style={styles.distLabelRow}>
                    <View style={styles.distNameBox}>
                      <View style={[styles.distColorDot, { backgroundColor: cat.color }]} />
                      <Text style={[styles.distName, { color: theme.textPrimary }]}>
                        {cat.name}
                      </Text>
                    </View>
                    <Text style={[styles.distValue, { color: theme.textSecondary }]}>
                      {cat.pcs.toLocaleString()} Pcs ({cat.percent}%)
                    </Text>
                  </View>

                  {/* Progress Bar Track */}
                  <View
                    style={[
                      styles.progressTrack,
                      { backgroundColor: theme.surfaceMuted },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${cat.percent}%`,
                          backgroundColor: cat.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))
            : CITY_STATS.map((c) => (
                <View key={c.city} style={styles.distRow}>
                  <View style={styles.distLabelRow}>
                    <View style={styles.distNameBox}>
                      <View style={[styles.distColorDot, { backgroundColor: c.color }]} />
                      <Text style={[styles.distName, { color: theme.textPrimary }]}>
                        {c.city}
                      </Text>
                    </View>
                    <Text style={[styles.distValue, { color: theme.textSecondary }]}>
                      {c.dispatches} Bills • {c.pcs.toLocaleString()} Pcs ({c.percent}%)
                    </Text>
                  </View>

                  {/* Progress Bar Track */}
                  <View
                    style={[
                      styles.progressTrack,
                      { backgroundColor: theme.surfaceMuted },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${c.percent}%`,
                          backgroundColor: c.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 160,
  },
  badgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIconText: {
    fontSize: 14,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  chartSubtitle: {
    fontSize: 10,
    marginTop: 1,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleBtnText: {
    fontSize: 10,
  },
  selectedBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  selectedMonthName: {
    fontSize: 11,
    fontWeight: '800',
  },
  selectedDetails: {
    fontSize: 11,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
  },
  growthBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  growthBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  chartBarsArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingBottom: 4,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 3,
    width: '100%',
  },
  singleBar: {
    width: 10,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
  },
  distributionList: {
    marginTop: 4,
  },
  distRow: {
    marginBottom: 12,
  },
  distLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  distNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  distColorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  distName: {
    fontSize: 11,
    fontWeight: '700',
  },
  distValue: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});

