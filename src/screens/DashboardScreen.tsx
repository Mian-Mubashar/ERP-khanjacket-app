import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { MetricCard } from '../components/MetricCard';
import { DashboardCharts } from '../components/DashboardCharts';
import { mobileApi, Customer, OutwardRecord } from '../services/api';
import { ScreenName } from '../components/SidebarDrawer';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState(() => mobileApi.getDashboardMetricsSync());
  const [recentOutward, setRecentOutward] = useState<OutwardRecord[]>(() =>
    mobileApi.getOutwardSync().slice(0, 3)
  );
  const [dueCustomers, setDueCustomers] = useState<Customer[]>(() =>
    mobileApi
      .getCustomersSync()
      .filter((c) => c.remainingBalance > 0)
      .slice(0, 3)
  );

  const loadData = async () => {
    try {
      const [m, custs, outw] = await Promise.all([
        mobileApi.getDashboardMetrics(),
        mobileApi.getCustomers(),
        mobileApi.getOutward(),
      ]);
      setMetrics(m);
      setRecentOutward(outw.slice(0, 3));
      setDueCustomers(custs.filter((c) => c.remainingBalance > 0).slice(0, 3));
    } catch {
      // Keep existing reactive state
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Welcome Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.heroRow}>
          <View style={styles.flexOne}>
            <Text style={[styles.heroSub, { color: theme.brandBlue }]}>
              OVERVIEW & STATISTICS
            </Text>
            <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
              Khan Clothes Portal
            </Text>
            <Text style={[styles.heroDesc, { color: theme.textSecondary }]}>
              China import stock, wholesale dispatches & shopkeeper khata.
            </Text>
          </View>
          <View
            style={[
              styles.activePill,
              {
                backgroundColor: theme.brandBlueLight,
                borderColor: theme.brandBlueBorder,
              },
            ]}
          >
            <Text style={[styles.activePillText, { color: theme.brandBlue }]}>
              {metrics.activeShops} Shops
            </Text>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={[styles.quickActions, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={() => onNavigate('Outward')}
            style={({ pressed }) => [
              styles.actionBtnPrimary,
              { backgroundColor: theme.brandBlue },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={styles.actionBtnPrimaryText}>+ New Rawangi</Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigate('Customers')}
            style={({ pressed }) => [
              styles.actionBtnOutline,
              {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
              },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.actionBtnOutlineText, { color: theme.textPrimary }]}>
              + Customer
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigate('Ugrahi')}
            style={({ pressed }) => [
              styles.actionBtnOutline,
              {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
              },
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={[styles.actionBtnOutlineText, { color: theme.textPrimary }]}>
              💰 Wasooli
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 4 KPI Metric Cards */}
      <View style={styles.metricsSection}>
        <MetricCard
          title="Total Mal Sent"
          value={`${Number(metrics.totalMalSent || 0).toLocaleString()} Pcs`}
          subtitle="Total wholesale garments dispatched"
          icon="🚚"
          variant="blue"
        />

        <MetricCard
          title="Total Billed"
          value={`Rs. ${Number(metrics.totalBilled || 0).toLocaleString()}`}
          subtitle="Total bill value across all shops"
          icon="📈"
          variant="purple"
        />

        <MetricCard
          title="Payment Received (Wasooli)"
          value={`Rs. ${Number(metrics.totalReceived || 0).toLocaleString()}`}
          subtitle="Total cash & bank wasooli recorded"
          icon="✓"
          variant="green"
        />

        <MetricCard
          title="Outstanding Balance Due"
          value={`Rs. ${Number(metrics.totalDue || 0).toLocaleString()}`}
          subtitle="Pending customer khata baqaya"
          icon="⚠️"
          variant="red"
        />
      </View>

      {/* Recent Maal Rawangi (Dispatches) Preview */}
      <View
        style={[
          styles.cardBox,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={[styles.cardHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Recent Outward (Maal Rawangi)
          </Text>
          <Pressable onPress={() => onNavigate('Outward')}>
            <Text style={[styles.viewAllText, { color: theme.brandBlue }]}>
              View All →
            </Text>
          </Pressable>
        </View>

        {recentOutward.map((item) => (
          <View
            key={item.id}
            style={[styles.listItem, { borderBottomColor: theme.border }]}
          >
            <View
              style={[
                styles.listIconBox,
                { backgroundColor: theme.brandBlueLight },
              ]}
            >
              <Text style={styles.emojiText}>🚚</Text>
            </View>
            <View style={styles.itemTextBox}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
                {item.customerName}
              </Text>
              <Text style={[styles.itemSub, { color: theme.textMuted }]}>
                {item.challanNo} • {item.city} • {item.date}
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={[styles.itemAmount, { color: theme.textPrimary }]}>
                {item.totalPieces} Pcs
              </Text>
              <Text style={[styles.itemBill, { color: theme.textMuted }]}>
                Rs. {Number(item.totalAmount || 0).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Outstanding Khata Balances Preview */}
      <View
        style={[
          styles.cardBox,
          styles.bottomBox,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={[styles.cardHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Pending Khata Baqaya
          </Text>
          <Pressable onPress={() => onNavigate('Customers')}>
            <Text style={[styles.viewAllText, { color: theme.brandBlue }]}>
              View Khata →
            </Text>
          </Pressable>
        </View>

        {dueCustomers.map((cust) => (
          <View
            key={cust.id}
            style={[styles.listItem, { borderBottomColor: theme.border }]}
          >
            <View
              style={[
                styles.listIconBox,
                { backgroundColor: theme.isDarkMode ? '#4c0519' : colors.dangerLight },
              ]}
            >
              <Text style={styles.emojiText}>👥</Text>
            </View>
            <View style={styles.itemTextBox}>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
                {cust.shopName}
              </Text>
              <Text style={[styles.itemSub, { color: theme.textMuted }]}>
                {cust.shopkeeperName} • {cust.city}
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text
                style={[
                  styles.itemAmount,
                  { color: theme.isDarkMode ? '#fb7185' : colors.danger },
                ]}
              >
                Rs. {Number(cust.remainingBalance || 0).toLocaleString()}
              </Text>
              <Text style={[styles.itemBill, { color: theme.textMuted }]}>
                Due Baqaya
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Analytics Charts & Graphs at the Very Bottom of Dashboard */}
      <View style={styles.chartsBottomWrapper}>
        <DashboardCharts />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flexOne: {
    flex: 1,
  },
  heroSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionBtnPrimary: {
    flex: 1.2,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBtnOutline: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
  btnPressed: {
    opacity: 0.8,
  },
  metricsSection: {
    marginBottom: 10,
  },
  cardBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  bottomBox: {
    marginBottom: 14,
  },
  chartsBottomWrapper: {
    marginBottom: 35,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  listIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 16,
  },
  itemTextBox: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11,
    marginTop: 2,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 13,
    fontWeight: '800',
  },
  itemBill: {
    fontSize: 10,
    marginTop: 1,
  },
});
