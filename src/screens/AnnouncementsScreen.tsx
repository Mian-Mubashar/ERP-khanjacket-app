import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  Linking,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ScreenName } from '../components/SidebarDrawer';
import { MetricCard } from '../components/MetricCard';
import {
  mobileApi,
  Customer,
  Article,
  OutwardRecord,
  PaymentRecord,
} from '../services/api';
import {
  formatCustomerDisplayName,
  formatCurrency,
  formatPieces,
} from '../utils/formatters';

interface AnnouncementsScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

type MainTab = 'WASOOLI_BILLS' | 'STOCK' | 'CUSTOMERS' | 'ALL';
type WasooliBillsFilter = 'ALL' | 'WASOOLI' | 'BILLS';
type StockTierFilter = 'ALL' | '0' | '10' | '20' | '30' | '40' | '50';
type CustomerKhataFilter = 'ALL' | 'OVERDUE' | 'DUE' | 'SETTLED';

export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();

  // Data State
  const [customers, setCustomers] = useState<Customer[]>(() => mobileApi.getCustomersSync());
  const [articles, setArticles] = useState<Article[]>(() => mobileApi.getArticlesSync());
  const [outward, setOutward] = useState<OutwardRecord[]>(() => mobileApi.getOutwardSync());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => mobileApi.getPaymentsSync());

  // Active Tabs & Filters
  const [activeTab, setActiveTab] = useState<MainTab>('WASOOLI_BILLS');
  const [wasooliBillsFilter, setWasooliBillsFilter] = useState<WasooliBillsFilter>('ALL');
  const [stockTierFilter, setStockTierFilter] = useState<StockTierFilter>('ALL');
  const [customerFilter, setCustomerFilter] = useState<CustomerKhataFilter>('ALL');
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');

  // Selected item modal for preview
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Load fresh data
  const loadData = async () => {
    try {
      const [c, a, o, p] = await Promise.all([
        mobileApi.getCustomers(),
        mobileApi.getArticles(),
        mobileApi.getOutward(),
        mobileApi.getPayments(),
      ]);
      setCustomers(c);
      setArticles(a);
      setOutward(o);
      setPayments(p);
    } catch {
      // Retain state
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Process Stock Alerts (<= 50%)
  const stockAlerts = useMemo(() => {
    return articles
      .map((art) => {
        const current = Number(art.currentStock) || 0;
        const initial = Number(art.initialStock) || Number(art.totalPurchased) || (current + (art.totalOut || 0)) || 100;
        const percent = initial > 0 ? Math.min(100, Math.max(0, Math.round((current / initial) * 100))) : 0;

        if (percent > 50) return null;

        let tier: StockTierFilter = '50';
        let tierLabel = '≤ 50% Stock';
        let urgency = 'Low Warning';
        let badgeColor = '#0284c7';

        if (current <= 0 || percent <= 0) {
          tier = '0';
          tierLabel = '0% Out of Stock!';
          urgency = 'Critical Shortage';
          badgeColor = '#e11d48';
        } else if (percent <= 10) {
          tier = '10';
          tierLabel = '≤ 10% Stock';
          urgency = 'Severe Alert';
          badgeColor = '#dc2626';
        } else if (percent <= 20) {
          tier = '20';
          tierLabel = '≤ 20% Stock';
          urgency = 'High Priority';
          badgeColor = '#ea580c';
        } else if (percent <= 30) {
          tier = '30';
          tierLabel = '≤ 30% Stock';
          urgency = 'Reorder Alert';
          badgeColor = '#d97706';
        } else if (percent <= 40) {
          tier = '40';
          tierLabel = '≤ 40% Stock';
          urgency = 'Moderate Alert';
          badgeColor = '#ca8a04';
        }

        return {
          id: `stock-${art.id}`,
          type: 'STOCK',
          rawItem: art,
          title: art.name,
          subtitle: `Article #${art.articleNo} • ${art.category}`,
          currentStock: current,
          initialStock: initial,
          percent,
          tier,
          tierLabel,
          urgency,
          badgeColor,
          location: art.warehouseLocation || 'Main Godown',
          unitPrice: art.unitPrice,
        };
      })
      .filter(Boolean) as any[];
  }, [articles]);

  // 2. Process Wasooli List (Payments)
  const wasooliList = useMemo(() => {
    return payments.map((p) => ({
      id: `wasooli-${p.id}`,
      type: 'WASOOLI',
      rawItem: p,
      title: formatCustomerDisplayName(p.customerName),
      subtitle: `${p.receiptNo || 'Receipt'} • ${p.paymentMethod} • ${p.city || 'Lahore'}`,
      amount: p.amount,
      date: p.date,
      notes: p.notes || 'Cash received against Challan',
      city: p.city || 'Lahore',
    }));
  }, [payments]);

  // 3. Process Bills List (Outward Dispatches)
  const billsList = useMemo(() => {
    return outward.map((o) => ({
      id: `bill-${o.id}`,
      type: 'BILL',
      rawItem: o,
      title: formatCustomerDisplayName(o.customerName),
      subtitle: `Bill #${o.challanNo} • ${o.totalPieces} Pcs • ${o.city || 'Lahore'}`,
      amount: o.totalAmount,
      date: o.date,
      notes: o.articleName || `${o.totalPieces} pcs dispatched`,
      city: o.city || 'Lahore',
    }));
  }, [outward]);

  // 4. Process Customer Khata Alerts
  const customerAlerts = useMemo(() => {
    return customers.map((c) => {
      const bal = Number(c.remainingBalance) || 0;
      const isOverdue = (c.daysPending || 0) >= 10 && bal > 0;
      return {
        id: `cust-${c.id}`,
        type: 'CUSTOMER',
        rawItem: c,
        title: formatCustomerDisplayName(c.shopName, c.shopkeeperName),
        subtitle: `${c.city} • ${c.phone} • ${c.marketAddress || 'Main Market'}`,
        remainingBalance: bal,
        totalBilled: c.totalBilled,
        totalPaid: c.totalPaid,
        daysPending: c.daysPending || 0,
        isOverdue,
        city: c.city,
      };
    });
  }, [customers]);

  // Combined Wasooli & Bills List
  const combinedWasooliBills = useMemo(() => {
    let list: any[] = [];
    if (wasooliBillsFilter === 'ALL') {
      list = [...wasooliList, ...billsList];
    } else if (wasooliBillsFilter === 'WASOOLI') {
      list = [...wasooliList];
    } else {
      list = [...billsList];
    }
    // Sort by date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [wasooliList, billsList, wasooliBillsFilter]);

  // Combined All Activity Timeline
  const allActivityTimeline = useMemo(() => {
    const list: any[] = [
      ...wasooliList,
      ...billsList,
      ...stockAlerts.map((s) => ({
        id: s.id,
        type: 'STOCK',
        rawItem: s.rawItem,
        title: s.title,
        subtitle: s.subtitle,
        amount: s.currentStock,
        date: 'Today',
        notes: `${s.tierLabel} (${s.currentStock} pcs remaining)`,
        city: s.location,
      })),
      ...customerAlerts
        .filter((c) => c.isOverdue)
        .map((c) => ({
          id: c.id,
          type: 'OVERDUE',
          rawItem: c.rawItem,
          title: c.title,
          subtitle: `${c.daysPending} Days Overdue • ${c.city}`,
          amount: c.remainingBalance,
          date: 'Active',
          notes: `No wasooli received for ${c.daysPending} days`,
          city: c.city,
        })),
    ];
    return list;
  }, [wasooliList, billsList, stockAlerts, customerAlerts]);

  // Filtered Display List
  const displayList = useMemo(() => {
    let items: any[] = [];

    if (activeTab === 'WASOOLI_BILLS') {
      items = combinedWasooliBills;
    } else if (activeTab === 'STOCK') {
      items = stockAlerts.filter((s) => {
        if (stockTierFilter === 'ALL') return true;
        return s.tier === stockTierFilter;
      });
    } else if (activeTab === 'CUSTOMERS') {
      items = customerAlerts.filter((c) => {
        if (customerFilter === 'OVERDUE') return c.isOverdue;
        if (customerFilter === 'DUE') return c.remainingBalance > 0;
        if (customerFilter === 'SETTLED') return c.remainingBalance <= 0;
        return true;
      });
    } else {
      items = allActivityTimeline;
    }

    // Apply Search & City
    return items.filter((item) => {
      if (selectedCity !== 'ALL' && item.city && item.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const str = `${item.title} ${item.subtitle} ${item.notes || ''}`.toLowerCase();
        return str.includes(q);
      }
      return true;
    });
  }, [
    activeTab,
    combinedWasooliBills,
    stockAlerts,
    customerAlerts,
    allActivityTimeline,
    stockTierFilter,
    customerFilter,
    selectedCity,
    search,
  ]);

  // Summary Metrics for the 4 Top Cards
  const totalWasooliSum = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalBillsSum = outward.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalCustomerDue = customers.reduce((sum, c) => sum + (Number(c.remainingBalance) || 0), 0);
  const outOfStockCount = stockAlerts.filter((s) => s.tier === '0').length;
  const shopsWithBalanceDue = customers.filter((c) => c.remainingBalance > 0).length;

  const cityOptions = ['ALL', 'Lahore', 'Islamabad', 'Sheikhupura', 'Rawalpindi'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Scrollable Container for Top Metrics & Content */}
      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Header Title & 10-Day Retention Pill */}
            <View
              style={[
                styles.headerCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.headerTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.retentionBadge}>
                    <Text style={styles.retentionDot}>🟢</Text>
                    <Text style={styles.retentionText}>10-Day Retention Active</Text>
                    {stockAlerts.length > 0 && (
                      <View style={styles.alertPill}>
                        <Text style={styles.alertPillText}>{stockAlerts.length} Low Stock</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                    Announcements & Activity
                  </Text>
                  <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                    Real-time feed of customer wasooli receipts, outward bills, inventory depletion alerts, and customer khata.
                  </Text>
                </View>
              </View>
            </View>

            {/* 4 TOP METRIC CARDS (1 line me 1 box - Spacious for large payment numbers) */}
            <View style={styles.metricsWrapper}>
              <MetricCard
                title="WASOOLI RECEIVED (10D)"
                value={formatCurrency(totalWasooliSum)}
                subtitle={`${payments.length} Payments in last 10 days`}
                icon="💰"
                variant="green"
                actionLabel="View Wasooli →"
                onPressAction={() => {
                  setActiveTab('WASOOLI_BILLS');
                  setWasooliBillsFilter('WASOOLI');
                }}
              />

              <MetricCard
                title="BILLS GENERATED (10D)"
                value={formatCurrency(totalBillsSum)}
                subtitle={`${outward.length} Dispatch Challans in last 10 days`}
                icon="↗️"
                variant="blue"
                actionLabel="View Bills →"
                onPressAction={() => {
                  setActiveTab('WASOOLI_BILLS');
                  setWasooliBillsFilter('BILLS');
                }}
              />

              <MetricCard
                title="STOCK ALERTS (≤ 50%)"
                value={`${stockAlerts.length} Models`}
                subtitle={`${outOfStockCount} Out of Stock • Critical warnings`}
                icon="⚠️"
                variant="amber"
                actionLabel="View Alerts →"
                onPressAction={() => {
                  setActiveTab('STOCK');
                  setStockTierFilter('ALL');
                }}
              />

              <MetricCard
                title="CUSTOMER BALANCE DUE"
                value={formatCurrency(totalCustomerDue)}
                subtitle={`${shopsWithBalanceDue} Shops with outstanding balance`}
                icon="👥"
                variant="red"
                actionLabel="View Khata →"
                onPressAction={() => {
                  setActiveTab('CUSTOMERS');
                  setCustomerFilter('DUE');
                }}
              />
            </View>

            {/* Primary Navigation Tabs */}
            <View
              style={[
                styles.tabsContainer,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                <Pressable
                  onPress={() => setActiveTab('WASOOLI_BILLS')}
                  style={[
                    styles.tabButton,
                    activeTab === 'WASOOLI_BILLS' && {
                      backgroundColor: theme.brandBlue,
                      borderColor: theme.brandBlue,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'WASOOLI_BILLS' ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    💳 Wasooli & Bills ({wasooliList.length + billsList.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab('STOCK')}
                  style={[
                    styles.tabButton,
                    activeTab === 'STOCK' && {
                      backgroundColor: '#f59e0b',
                      borderColor: '#f59e0b',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'STOCK' ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    ⚠️ Stock Alerts ({stockAlerts.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab('CUSTOMERS')}
                  style={[
                    styles.tabButton,
                    activeTab === 'CUSTOMERS' && {
                      backgroundColor: '#e11d48',
                      borderColor: '#e11d48',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'CUSTOMERS' ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    👥 Customer Khata ({customerAlerts.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab('ALL')}
                  style={[
                    styles.tabButton,
                    activeTab === 'ALL' && {
                      backgroundColor: theme.textPrimary,
                      borderColor: theme.textPrimary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      { color: activeTab === 'ALL' ? (theme.isDarkMode ? '#000' : '#fff') : theme.textSecondary },
                    ]}
                  >
                    ⚡ All Activity ({allActivityTimeline.length})
                  </Text>
                </Pressable>
              </ScrollView>

              {/* Sub-Filters based on Active Tab */}
              {activeTab === 'WASOOLI_BILLS' && (
                <View style={styles.subFilterRow}>
                  <Text style={[styles.subFilterLabel, { color: theme.textMuted }]}>Type:</Text>
                  {(['ALL', 'WASOOLI', 'BILLS'] as WasooliBillsFilter[]).map((f) => (
                    <Pressable
                      key={f}
                      onPress={() => setWasooliBillsFilter(f)}
                      style={[
                        styles.subFilterChip,
                        wasooliBillsFilter === f
                          ? { backgroundColor: theme.brandBlueLight, borderColor: theme.brandBlue }
                          : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subFilterText,
                          {
                            color: wasooliBillsFilter === f ? theme.brandBlue : theme.textSecondary,
                            fontWeight: wasooliBillsFilter === f ? '700' : '500',
                          },
                        ]}
                      >
                        {f === 'ALL' ? `All (${wasooliList.length + billsList.length})` : f === 'WASOOLI' ? `Wasooli Receipts (${wasooliList.length})` : `Bills / Dispatches (${billsList.length})`}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {activeTab === 'STOCK' && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subFilterScroll}>
                  <Text style={[styles.subFilterLabel, { color: theme.textMuted, alignSelf: 'center', marginRight: 4 }]}>Tier:</Text>
                  {(['ALL', '0', '10', '20', '30', '40', '50'] as StockTierFilter[]).map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setStockTierFilter(t)}
                      style={[
                        styles.subFilterChip,
                        stockTierFilter === t
                          ? { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }
                          : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subFilterText,
                          {
                            color: stockTierFilter === t ? '#b45309' : theme.textSecondary,
                            fontWeight: stockTierFilter === t ? '700' : '500',
                          },
                        ]}
                      >
                        {t === 'ALL' ? 'All Alerts' : t === '0' ? '0% Out of Stock' : `≤ ${t}%`}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {activeTab === 'CUSTOMERS' && (
                <View style={styles.subFilterRow}>
                  <Text style={[styles.subFilterLabel, { color: theme.textMuted }]}>Status:</Text>
                  {(['ALL', 'OVERDUE', 'DUE', 'SETTLED'] as CustomerKhataFilter[]).map((cf) => (
                    <Pressable
                      key={cf}
                      onPress={() => setCustomerFilter(cf)}
                      style={[
                        styles.subFilterChip,
                        customerFilter === cf
                          ? { backgroundColor: '#ffe4e6', borderColor: '#e11d48' }
                          : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subFilterText,
                          {
                            color: customerFilter === cf ? '#be123c' : theme.textSecondary,
                            fontWeight: customerFilter === cf ? '700' : '500',
                          },
                        ]}
                      >
                        {cf === 'ALL' ? 'All Khata' : cf === 'OVERDUE' ? '⚠️ Overdue (10d+)' : cf === 'DUE' ? 'Pending Due' : 'Settled'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Search & City Filter Bar */}
              <View style={styles.searchBarRow}>
                <View
                  style={[
                    styles.searchInputBox,
                    {
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 13, marginRight: 6 }}>🔍</Text>
                  <TextInput
                    placeholder="Search by shop, article, bill #..."
                    placeholderTextColor="#94a3b8"
                    value={search}
                    onChangeText={setSearch}
                    style={[styles.searchInput, { color: theme.textPrimary }]}
                  />
                  {search ? (
                    <Pressable onPress={() => setSearch('')} hitSlop={6}>
                      <Text style={{ color: '#94a3b8', fontSize: 12 }}>✕</Text>
                    </Pressable>
                  ) : null}
                </View>

                {/* City Picker Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityScroll}>
                  {cityOptions.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setSelectedCity(c)}
                      style={[
                        styles.cityChip,
                        selectedCity === c
                          ? { backgroundColor: theme.brandBlue, borderColor: theme.brandBlue }
                          : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cityChipText,
                          { color: selectedCity === c ? '#fff' : theme.textSecondary },
                        ]}
                      >
                        {c === 'ALL' ? 'All Cities' : c}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Section Header */}
            <View style={styles.listHeaderRow}>
              <Text style={[styles.listHeaderTitle, { color: theme.textMuted }]}>
                SHOWING {displayList.length} ITEMS
              </Text>
              <Text style={[styles.listHeaderSub, { color: theme.brandBlue }]}>
                Live Database Feed
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const isWasooli = item.type === 'WASOOLI';
          const isBill = item.type === 'BILL';
          const isStock = item.type === 'STOCK';
          const isCustomer = item.type === 'CUSTOMER';
          const isOverdue = item.type === 'OVERDUE' || (isCustomer && item.isOverdue);

          return (
            <Pressable
              onPress={() => setSelectedItem(item)}
              style={({ pressed }) => [
                styles.itemCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
                isWasooli && { borderLeftColor: '#10b981', borderLeftWidth: 3.5 },
                isBill && { borderLeftColor: '#0284c7', borderLeftWidth: 3.5 },
                isStock && { borderLeftColor: item.badgeColor || '#f59e0b', borderLeftWidth: 3.5 },
                isOverdue && { borderLeftColor: '#e11d48', borderLeftWidth: 3.5 },
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={styles.itemRow}>
                {/* Type Icon Badge */}
                <View
                  style={[
                    styles.typeIconBox,
                    isWasooli && { backgroundColor: '#ecfdf5' },
                    isBill && { backgroundColor: '#f0f9ff' },
                    isStock && { backgroundColor: '#fffbeb' },
                    isOverdue && { backgroundColor: '#fff1f2' },
                  ]}
                >
                  <Text style={styles.typeIconText}>
                    {isWasooli ? '💰' : isBill ? '📦' : isStock ? '⚠️' : '👥'}
                  </Text>
                </View>

                {/* Details */}
                <View style={styles.itemContent}>
                  <View style={styles.itemTitleRow}>
                    <Text
                      style={[styles.itemTitle, { color: theme.textPrimary }]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    {isWasooli && (
                      <View style={[styles.pillBadge, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                        <Text style={[styles.pillBadgeText, { color: '#059669' }]}>Wasooli</Text>
                      </View>
                    )}
                    {isBill && (
                      <View style={[styles.pillBadge, { backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }]}>
                        <Text style={[styles.pillBadgeText, { color: '#0284c7' }]}>Bill</Text>
                      </View>
                    )}
                    {isStock && (
                      <View style={[styles.pillBadge, { backgroundColor: '#fffbeb', borderColor: '#fde68a' }]}>
                        <Text style={[styles.pillBadgeText, { color: item.badgeColor || '#d97706' }]}>
                          {item.tierLabel}
                        </Text>
                      </View>
                    )}
                    {isOverdue && (
                      <View style={[styles.pillBadge, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
                        <Text style={[styles.pillBadgeText, { color: '#e11d48' }]}>Overdue</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.itemSubtitle, { color: theme.textMuted }]} numberOfLines={1}>
                    {item.subtitle}
                  </Text>

                  {item.notes ? (
                    <Text style={[styles.itemNotes, { color: theme.textSecondary }]} numberOfLines={1}>
                      {item.notes}
                    </Text>
                  ) : null}
                </View>

                {/* Right Value & Date */}
                <View style={styles.itemRight}>
                  {isWasooli && (
                    <Text style={[styles.itemAmount, { color: '#059669' }]}>
                      +{formatCurrency(item.amount)}
                    </Text>
                  )}
                  {isBill && (
                    <Text style={[styles.itemAmount, { color: theme.textPrimary }]}>
                      {formatCurrency(item.amount)}
                    </Text>
                  )}
                  {isStock && (
                    <Text
                      style={[
                        styles.itemAmount,
                        { color: item.currentStock <= 0 ? '#e11d48' : '#d97706' },
                      ]}
                    >
                      {item.currentStock} Pcs
                    </Text>
                  )}
                  {isCustomer && (
                    <Text
                      style={[
                        styles.itemAmount,
                        { color: item.remainingBalance > 0 ? '#e11d48' : '#059669' },
                      ]}
                    >
                      {formatCurrency(item.remainingBalance)}
                    </Text>
                  )}

                  <Text style={[styles.itemDate, { color: theme.textMuted }]}>
                    {item.date || 'Active'}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 36 }}>✨</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              No announcements found
            </Text>
            <Text style={[styles.emptySub, { color: theme.textMuted }]}>
              Try changing the search filter or selected tab.
            </Text>
          </View>
        }
      />

      {/* Item Quick Preview Modal */}
      {selectedItem && (
        <Modal
          visible={!!selectedItem}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedItem(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  {selectedItem.type === 'WASOOLI'
                    ? '💰 Wasooli Payment Detail'
                    : selectedItem.type === 'BILL'
                    ? '📦 Outward Dispatch Bill'
                    : selectedItem.type === 'STOCK'
                    ? '⚠️ Low Stock Warning'
                    : '👥 Customer Khata Details'}
                </Text>
                <Pressable onPress={() => setSelectedItem(null)} hitSlop={10}>
                  <Text style={{ fontSize: 18, color: theme.textMuted }}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                <Text style={[styles.modalMainName, { color: theme.textPrimary }]}>
                  {selectedItem.title}
                </Text>
                <Text style={[styles.modalSub, { color: theme.textSecondary }]}>
                  {selectedItem.subtitle}
                </Text>

                <View
                  style={[
                    styles.modalInfoBox,
                    {
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.modalInfoText, { color: theme.textSecondary }]}>
                    {selectedItem.notes || 'No extra notes recorded.'}
                  </Text>
                </View>

                {/* Action Buttons inside Modal */}
                <View style={styles.modalActionRow}>
                  {selectedItem.type === 'STOCK' && onNavigate && (
                    <Pressable
                      onPress={() => {
                        setSelectedItem(null);
                        onNavigate('Articles');
                      }}
                      style={[styles.modalBtnPrimary, { backgroundColor: theme.brandBlue }]}
                    >
                      <Text style={styles.modalBtnPrimaryText}>Go to Garments Stock →</Text>
                    </Pressable>
                  )}

                  {selectedItem.type === 'WASOOLI' && onNavigate && (
                    <Pressable
                      onPress={() => {
                        setSelectedItem(null);
                        onNavigate('Ugrahi');
                      }}
                      style={[styles.modalBtnPrimary, { backgroundColor: '#10b981' }]}
                    >
                      <Text style={styles.modalBtnPrimaryText}>Open Wasooli Route Sheet →</Text>
                    </Pressable>
                  )}

                  {selectedItem.type === 'BILL' && onNavigate && (
                    <Pressable
                      onPress={() => {
                        setSelectedItem(null);
                        onNavigate('Outward');
                      }}
                      style={[styles.modalBtnPrimary, { backgroundColor: theme.brandBlue }]}
                    >
                      <Text style={styles.modalBtnPrimaryText}>View Dispatches List →</Text>
                    </Pressable>
                  )}

                  {selectedItem.type === 'CUSTOMER' && onNavigate && (
                    <Pressable
                      onPress={() => {
                        setSelectedItem(null);
                        onNavigate('Customers');
                      }}
                      style={[styles.modalBtnPrimary, { backgroundColor: '#e11d48' }]}
                    >
                      <Text style={styles.modalBtnPrimaryText}>View Customer Khata →</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 40,
  },
  headerCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  retentionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  retentionDot: {
    fontSize: 10,
  },
  retentionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  alertPill: {
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginLeft: 6,
  },
  alertPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#e11d48',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },

  /* Top Metric Cards - 1 box per line */
  metricsWrapper: {
    marginBottom: 4,
  },

  /* Navigation Tabs */
  tabsContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  tabsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  /* Sub Filter Strip */
  subFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  subFilterScroll: {
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  subFilterLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginRight: 4,
  },
  subFilterChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 4,
  },
  subFilterText: {
    fontSize: 10.5,
  },

  /* Search & City */
  searchBarRow: {
    marginTop: 10,
    gap: 8,
  },
  searchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  cityScroll: {
    flexDirection: 'row',
  },
  cityChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  cityChipText: {
    fontSize: 10.5,
    fontWeight: '600',
  },

  /* Section Header */
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  listHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  listHeaderSub: {
    fontSize: 10,
    fontWeight: '700',
  },

  /* Item Card */
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 11,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  typeIconText: {
    fontSize: 16,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  itemTitle: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
  },
  pillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  itemSubtitle: {
    fontSize: 10.5,
    marginBottom: 2,
  },
  itemNotes: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 9.5,
  },

  /* Empty state */
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 11,
    marginTop: 4,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalBody: {
    gap: 6,
  },
  modalMainName: {
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 12,
    marginBottom: 8,
  },
  modalInfoBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  modalInfoText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  modalActionRow: {
    marginTop: 6,
  },
  modalBtnPrimary: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
