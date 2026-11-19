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
import { formatCustomerDisplayName, formatCurrency } from '../utils/formatters';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState(() => mobileApi.getDashboardMetricsSync());
  const [recentOutward, setRecentOutward] = useState<OutwardRecord[]>(() =>
    mobileApi.getOutwardSync().slice(0, 4)
  );
  const [dueCustomers, setDueCustomers] = useState<Customer[]>(() =>
    mobileApi
      .getCustomersSync()
      .filter((c) => c.remainingBalance > 0)
      .slice(0, 4)
  );

  const loadData = async () => {
    try {
      const [m, custs, outw] = await Promise.all([
        mobileApi.getDashboardMetrics(),
        mobileApi.getCustomers(),
        mobileApi.getOutward(),
      ]);
      setMetrics(m);
      setRecentOutward(outw.slice(0, 4));
      setDueCustomers(custs.filter((c) => c.remainingBalance > 0).slice(0, 4));
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
              Khan Jacket House ERP
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

      {/* 4 KPI Metric Cards (1 line me 1 box - Spacious for large numbers) */}
      <View style={styles.metricsWrapper}>
        <MetricCard
          title="TOTAL INCOME"
          value={formatCurrency(metrics.totalReceived)}
          subtitle={`${metrics.activeShops || 5} Wasooli Records • All-Time`}
          icon="👛"
          variant="blue"
          actionLabel="View List →"
          onPressAction={() => onNavigate('Ugrahi')}
        />

        <MetricCard
          title="TOTAL EXPENSE"
          value="RMB. 1,800"
          subtitle="China Factory & Freight Paid"
          icon="📑"
          variant="cyan"
          actionLabel="Logistics →"
          onPressAction={() => onNavigate('Purchases')}
        />

        <MetricCard
          title="MAAL SENT"
          value={`${Number(metrics.totalMalSent || 0).toLocaleString()} pcs`}
          subtitle={`Total Wholesale Billed: ${formatCurrency(metrics.totalBilled)}`}
          icon="🚚"
          variant="purple"
          actionLabel="View Bills →"
          onPressAction={() => onNavigate('Outward')}
        />

        <MetricCard
          title="BAQAYA REMAINING"
          value={formatCurrency(metrics.totalDue)}
          subtitle="Pending customer khata balance"
          icon="💳"
          variant="red"
          actionLabel="View Khata →"
          onPressAction={() => onNavigate('Customers')}
        />
      </View>

      {/* 4 Outlets Stock Breakdown Card */}
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
            Shop & Warehouse Stock Dispatches
          </Text>
          <Pressable onPress={() => onNavigate('Outward')}>
            <Text style={[styles.viewAllText, { color: theme.brandBlue }]}>
              Open Flow →
            </Text>
          </Pressable>
        </View>

        <View style={styles.outletsStack}>
          {/* Outlet 1: Central Godown */}
          <View style={[styles.outletRowItem, { backgroundColor: theme.surfaceMuted, borderColor: theme.border, borderLeftColor: theme.brandBlue, borderLeftWidth: 3.5 }]}>
            <View style={[styles.outletIconCircle, { backgroundColor: theme.brandBlueLight }]}>
              <Text style={styles.outletIcon}>🏢</Text>
            </View>
            <View style={styles.outletInfoCol}>
              <Text style={[styles.outletName, { color: theme.textPrimary }]}>Central Godown</Text>
              <Text style={[styles.outletSub, { color: theme.textMuted }]}>Main Warehouse Central Stock</Text>
            </View>
            <View style={styles.outletStockCol}>
              <Text style={[styles.outletStock, { color: theme.brandBlue }]}>{metrics.totalStock || 500} Pcs</Text>
              <Text style={[styles.outletStockLabel, { color: theme.textMuted }]}>In Stock</Text>
            </View>
          </View>

          {/* Outlet 2: Khan Jacket House */}
          <View style={[styles.outletRowItem, { backgroundColor: theme.surfaceMuted, borderColor: theme.border, borderLeftColor: '#10b981', borderLeftWidth: 3.5 }]}>
            <View style={[styles.outletIconCircle, { backgroundColor: '#ecfdf5' }]}>
              <Text style={styles.outletIcon}>🧥</Text>
            </View>
            <View style={styles.outletInfoCol}>
              <Text style={[styles.outletName, { color: theme.textPrimary }]}>Khan Jacket House</Text>
              <Text style={[styles.outletSub, { color: theme.textMuted }]}>Main Retail Outlet (Lahore)</Text>
            </View>
            <View style={styles.outletStockCol}>
              <Text style={[styles.outletStock, { color: '#059669' }]}>200 Pcs</Text>
              <Text style={[styles.outletStockLabel, { color: theme.textMuted }]}>Stock Sent</Text>
            </View>
          </View>

          {/* Outlet 3: MK Collection */}
          <View style={[styles.outletRowItem, { backgroundColor: theme.surfaceMuted, borderColor: theme.border, borderLeftColor: '#8b5cf6', borderLeftWidth: 3.5 }]}>
            <View style={[styles.outletIconCircle, { backgroundColor: '#f5f3ff' }]}>
              <Text style={styles.outletIcon}>🏪</Text>
            </View>
            <View style={styles.outletInfoCol}>
              <Text style={[styles.outletName, { color: theme.textPrimary }]}>MK Collection</Text>
              <Text style={[styles.outletSub, { color: theme.textMuted }]}>Branch 2 Outlet (Lahore)</Text>
            </View>
            <View style={styles.outletStockCol}>
              <Text style={[styles.outletStock, { color: '#7c3aed' }]}>150 Pcs</Text>
              <Text style={[styles.outletStockLabel, { color: theme.textMuted }]}>Stock Sent</Text>
            </View>
          </View>

          {/* Outlet 4: Wholesale Clients */}
          <View style={[styles.outletRowItem, { backgroundColor: theme.surfaceMuted, borderColor: theme.border, borderLeftColor: '#f59e0b', borderLeftWidth: 3.5 }]}>
            <View style={[styles.outletIconCircle, { backgroundColor: '#fffbeb' }]}>
              <Text style={styles.outletIcon}>👥</Text>
            </View>
            <View style={styles.outletInfoCol}>
              <Text style={[styles.outletName, { color: theme.textPrimary }]}>Wholesale Clients</Text>
              <Text style={[styles.outletSub, { color: theme.textMuted }]}>Direct Wholesale Dispatches</Text>
            </View>
            <View style={styles.outletStockCol}>
              <Text style={[styles.outletStock, { color: '#d97706' }]}>{metrics.totalMalSent || 373} Pcs</Text>
              <Text style={[styles.outletStockLabel, { color: theme.textMuted }]}>Total Sent</Text>
            </View>
          </View>
        </View>
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
                {formatCustomerDisplayName(item.customerName)}
              </Text>
              <Text style={[styles.itemSub, { color: theme.textMuted }]}>
                {item.challanNo ? `Challan #${item.challanNo}` : ''} • {item.city} • {item.date}
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text style={[styles.itemAmount, { color: theme.textPrimary }]}>
                {item.totalPieces} Pcs
              </Text>
              <Text style={[styles.itemBill, { color: theme.textMuted }]}>
                {formatCurrency(item.totalAmount)}
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
                {formatCustomerDisplayName(cust.shopName, cust.shopkeeperName)}
              </Text>
              <Text style={[styles.itemSub, { color: theme.textMuted }]}>
                {cust.city} • {cust.phone}
              </Text>
            </View>
            <View style={styles.alignEnd}>
              <Text
                style={[
                  styles.itemAmount,
                  { color: theme.isDarkMode ? '#fb7185' : colors.danger },
                ]}
              >
                {formatCurrency(cust.remainingBalance)}
              </Text>
              <Text style={[styles.itemBill, { color: theme.textMuted }]}>
                Due Baqaya
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Analytics Charts & Graphs */}
      <View style={styles.chartsBottomWrapper}>
        <DashboardCharts />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  heroCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
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
    fontSize: 11.5,
    marginTop: 4,
    lineHeight: 16,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 6,
  },
  activePillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  actionBtnPrimary: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  actionBtnOutline: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionBtnOutlineText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.7,
  },

  /* Metrics Wrapper (1 box per line) */
  metricsWrapper: {
    marginBottom: 4,
  },

  /* Outlets Stack (1 box per line) */
  outletsStack: {
    padding: 10,
    gap: 8,
  },
  outletRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 11,
  },
  outletIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  outletIcon: {
    fontSize: 16,
  },
  outletInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  outletName: {
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  outletSub: {
    fontSize: 10,
  },
  outletStockCol: {
    alignItems: 'flex-end',
  },
  outletStock: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  outletStockLabel: {
    fontSize: 9.5,
    marginTop: 1,
  },

  cardBox: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  bottomBox: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  listIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emojiText: {
    fontSize: 14,
  },
  itemTextBox: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 10,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemBill: {
    fontSize: 10,
  },
  chartsBottomWrapper: {
    marginBottom: 30,
  },
});
