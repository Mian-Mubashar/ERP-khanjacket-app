import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface PurchaseOrder {
  id: number;
  orderNo: string;
  vendorName: string;
  containerNo: string;
  totalPcs: number;
  totalCost: number;
  currency: string;
  status: 'Arrived' | 'On Ship' | 'Ordered';
  date: string;
}

const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: 1,
    orderNo: 'PO-CN-901',
    vendorName: 'Guangzhou Jinlong Garments',
    containerNo: 'MSKU-8821940',
    totalPcs: 1200,
    totalCost: 19800,
    currency: 'USD',
    status: 'Arrived',
    date: '02/11/2026',
  },
  {
    id: 2,
    orderNo: 'PO-CN-902',
    vendorName: 'Yiwu Winter Jacket Manufacturing',
    containerNo: 'TCLU-4412091',
    totalPcs: 850,
    totalCost: 14200,
    currency: 'USD',
    status: 'On Ship',
    date: '28/10/2026',
  },
  {
    id: 3,
    orderNo: 'PO-CN-903',
    vendorName: 'Shaoxing Textile & Outerwear',
    containerNo: 'Pending Booking',
    totalPcs: 600,
    totalCost: 9900,
    currency: 'USD',
    status: 'Ordered',
    date: '10/11/2026',
  },
];

export const PurchasesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [purchases] = useState<PurchaseOrder[]>(INITIAL_PURCHASES);
  const [search, setSearch] = useState('');

  const filtered = purchases.filter(
    (p) =>
      !search ||
      p.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      p.containerNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Search */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchRow,
            {
              backgroundColor: theme.surfaceMuted,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            placeholder="Search PO #, vendor, container #..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')} style={styles.clearSearchBtn}>
              <Text style={{ fontSize: 13, color: '#94a3b8' }}>✕</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryTitle, { color: theme.textSecondary }]}>
            China Purchases & Sea Shipments Tracking
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const isArrived = item.status === 'Arrived';
          const isOnShip = item.status === 'On Ship';
          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.poRow}>
                    <Text
                      style={[
                        styles.poBadge,
                        {
                          backgroundColor: theme.brandBlueLight,
                          color: theme.brandBlue,
                        },
                      ]}
                    >
                      {item.orderNo}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: isArrived
                            ? theme.successLight
                            : isOnShip
                            ? theme.brandBlueLight
                            : theme.warningLight,
                          borderColor: isArrived
                            ? theme.successBorder
                            : isOnShip
                            ? theme.brandBlueBorder
                            : theme.warningBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: isArrived
                              ? theme.success
                              : isOnShip
                              ? theme.brandBlue
                              : theme.warning,
                          },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.vendorName, { color: theme.textPrimary }]}>{item.vendorName}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.costVal, { color: theme.brandBlue }]}>
                    ${item.totalCost.toLocaleString()}
                  </Text>
                  <Text style={[styles.pcsVal, { color: theme.textMuted }]}>{item.totalPcs} Pcs</Text>
                </View>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <Text style={[styles.containerText, { color: theme.textSecondary }]}>
                  🚢 Cont: <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{item.containerNo}</Text>
                </Text>
                <Text style={[styles.dateText, { color: theme.textMuted }]}>📅 {item.date}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32 }}>🚢</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No purchase orders found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    padding: 12,
    borderBottomWidth: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  summaryRow: {
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  poRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  poBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  vendorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  costVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  pcsVal: {
    fontSize: 11,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  containerText: {
    fontSize: 11,
  },
  dateText: {
    fontSize: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
});
