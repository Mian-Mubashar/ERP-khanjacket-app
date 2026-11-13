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

interface ClearanceBill {
  id: number;
  billNo: string;
  clearingAgent: string;
  containerNo: string;
  port: string;
  dutyCharges: number;
  paidAmount: number;
  remainingDue: number;
  status: 'Cleared' | 'Pending Duty' | 'In Process';
}

const INITIAL_CLEARANCE: ClearanceBill[] = [
  {
    id: 1,
    billNo: 'CLR-2026-08',
    clearingAgent: 'Khan Traders Clearance',
    containerNo: 'MSKU-8821940',
    port: 'Karachi Port (QICT)',
    dutyCharges: 449000,
    paidAmount: 49000,
    remainingDue: 400000,
    status: 'Pending Duty',
  },
  {
    id: 2,
    billNo: 'CLR-2026-07',
    clearingAgent: 'Al-Haram Logistics & Clearance',
    containerNo: 'TCLU-4412091',
    port: 'Port Qasim Karachi',
    dutyCharges: 380000,
    paidAmount: 380000,
    remainingDue: 0,
    status: 'Cleared',
  },
];

export const ClearanceScreen: React.FC = () => {
  const { theme } = useTheme();
  const [bills] = useState<ClearanceBill[]>(INITIAL_CLEARANCE);
  const [search, setSearch] = useState('');

  const filtered = bills.filter((b) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (b.billNo && b.billNo.toLowerCase().includes(q)) ||
      (b.clearingAgent && b.clearingAgent.toLowerCase().includes(q)) ||
      (b.containerNo && b.containerNo.toLowerCase().includes(q))
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
            placeholder="Search clearance bill #, agent, container..."
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
            Customs Duty & Port Consignment Clearance Khata
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const hasDue = item.remainingDue > 0;
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
                  <View style={styles.billRow}>
                    <Text
                      style={[
                        styles.billBadge,
                        {
                          backgroundColor: theme.brandBlueLight,
                          color: theme.brandBlue,
                        },
                      ]}
                    >
                      {item.billNo}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: hasDue ? theme.warningLight : theme.successLight,
                          borderColor: hasDue ? theme.warningBorder : theme.successBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: hasDue ? theme.warning : theme.success },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.agentName, { color: theme.textPrimary }]}>{item.clearingAgent}</Text>
                  <Text style={[styles.portText, { color: theme.textMuted }]}>⚓ {item.port}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.dueVal,
                      { color: hasDue ? theme.danger : theme.success },
                    ]}
                  >
                    {hasDue ? `Due: Rs. ${Number(item.remainingDue || 0).toLocaleString()}` : 'Settled'}
                  </Text>
                  <Text style={[styles.totalCharges, { color: theme.textMuted }]}>
                    Total: Rs. {Number(item.dutyCharges || 0).toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <Text style={[styles.containerText, { color: theme.textSecondary }]}>
                  Container: <Text style={{ fontWeight: '700', color: theme.textPrimary }}>{item.containerNo}</Text>
                </Text>
                <Text style={[styles.paidText, { color: theme.success }]}>
                  Paid: Rs. {Number(item.paidAmount || 0).toLocaleString()}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32 }}>⚓</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No clearance bills found</Text>
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
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  billBadge: {
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
  agentName: {
    fontSize: 13,
    fontWeight: '700',
  },
  portText: {
    fontSize: 11,
    marginTop: 2,
  },
  dueVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  totalCharges: {
    fontSize: 10,
    marginTop: 2,
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
  paidText: {
    fontSize: 11,
    fontWeight: '700',
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
