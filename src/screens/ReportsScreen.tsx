import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { MetricCard } from '../components/MetricCard';

export const ReportsScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.headerBox,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Hisaab Kitaab & Financial Reports
        </Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Comprehensive statements of sales, stock valuation, and receivables.
        </Text>
      </View>

      <View style={{ marginBottom: 12 }}>
        <MetricCard
          title="Total Wholesale Turnover"
          value="Rs. 667,717"
          subtitle="Net sales recorded across all branches"
          icon="📈"
          variant="blue"
        />
        <MetricCard
          title="Recovered Wasooli"
          value="Rs. 324,400"
          subtitle="Cash & bank collections deposited"
          icon="✓"
          variant="green"
        />
        <MetricCard
          title="Market Market Receivables"
          value="Rs. 343,317"
          subtitle="Total credit extended to shopkeepers"
          icon="⚠️"
          variant="red"
        />
        <MetricCard
          title="Warehouse Stock Assets"
          value="1,045 Pieces"
          subtitle="Approx Wholesale Value: Rs. 1,620,000"
          icon="📦"
          variant="purple"
        />
      </View>

      <View
        style={[
          styles.reportCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.reportCardTitle,
            {
              color: theme.textPrimary,
              borderBottomColor: theme.border,
            },
          ]}
        >
          Branch-Wise Sales Summary
        </Text>
        <View style={[styles.rowItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Lahore Division</Text>
          <Text style={[styles.rowVal, { color: theme.textPrimary }]}>470 Pcs (Rs. 620,000)</Text>
        </View>
        <View style={[styles.rowItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Islamabad & Rawalpindi</Text>
          <Text style={[styles.rowVal, { color: theme.textPrimary }]}>145 Pcs (Rs. 187,000)</Text>
        </View>
        <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
          <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>Sheikhupura & Outstations</Text>
          <Text style={[styles.rowVal, { color: theme.textPrimary }]}>60 Pcs (Rs. 109,217)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  headerBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 4,
  },
  reportCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 40,
  },
  reportCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 12,
  },
  rowVal: {
    fontSize: 12,
    fontWeight: '700',
  },
});
