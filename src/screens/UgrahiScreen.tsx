import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { mobileApi, Customer, CityRecord } from '../services/api';
import { formatCustomerDisplayName } from '../utils/formatters';

export const UgrahiScreen: React.FC = () => {
  const { theme } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>(() => mobileApi.getCustomersSync());
  const [cities, setCities] = useState<CityRecord[]>(() => mobileApi.getCitiesSync());
  const [selectedRoute, setSelectedRoute] = useState<string>('ALL');

  // Wasooli Modal
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [targetCust, setTargetCust] = useState<Customer | null>(null);
  const [wasooliAmount, setWasooliAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online / Bank' | 'Cheque'>('Cash');

  const loadData = async () => {
    try {
      const [custs, c] = await Promise.all([
        mobileApi.getCustomers(),
        mobileApi.getCities(),
      ]);
      setCustomers(custs);
      setCities(c);
    } catch {
      // Keep reactive store
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const routeList = ['ALL', ...cities.map((c) => c.name)];

  const ugrahiCustomers = customers.filter((c) => {
    if (selectedRoute === 'ALL') {
      return true;
    }
    return (c.ugrahiRoute || c.city || '').toLowerCase() === selectedRoute.toLowerCase();
  });

  const totalDueOnRoute = ugrahiCustomers.reduce((sum, c) => sum + (c.remainingBalance || 0), 0);

  const handleOpenWasooli = (cust: Customer) => {
    setTargetCust(cust);
    setWasooliAmount(String(cust.remainingBalance > 0 ? cust.remainingBalance : 10000));
    setPaymentMode('Cash');
    setPaymentModalVisible(true);
  };

  const handleRecordPayment = async () => {
    if (!targetCust || !wasooliAmount) {
      return;
    }

    const amt = Number(wasooliAmount) || 0;
    if (amt <= 0) {
      return;
    }

    await mobileApi.recordPayment(targetCust.id, amt, paymentMode);
    setPaymentModalVisible(false);
    loadData();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Route Filter & Metrics Strip */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.routeLabel, { color: theme.textMuted }]}>
          SELECT COLLECTION ROUTE (SHEHAR):
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routeScroll}>
          {routeList.map((route) => {
            const isSelected = selectedRoute === route;
            return (
              <Pressable
                key={route}
                onPress={() => setSelectedRoute(route)}
                style={[
                  styles.routeChip,
                  {
                    backgroundColor: isSelected ? theme.brandBlue : theme.surfaceMuted,
                    borderColor: isSelected ? theme.brandBlue : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.routeChipText,
                    { color: isSelected ? '#ffffff' : theme.textSecondary },
                    isSelected && styles.routeChipTextActive,
                  ]}
                >
                  {route === 'ALL' ? 'All Routes' : `📍 ${route}`}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.summaryRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.summaryText, { color: theme.textPrimary }]}>
            {ugrahiCustomers.length} Accounts Scheduled for Wasooli
          </Text>
          <Text style={[styles.summaryDue, { color: theme.danger }]}>
            Outstanding: Rs. {Number(totalDueOnRoute || 0).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Wasooli Sheet List */}
      <FlatList
        data={ugrahiCustomers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
        renderItem={({ item, index }) => {
          const hasDue = item.remainingBalance > 0;
          return (
            <View
              style={[
                styles.sheetCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.indexCircle, { backgroundColor: theme.brandBlueLight }]}>
                  <Text style={[styles.indexText, { color: theme.brandBlue }]}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.shopName, { color: theme.textPrimary }]}>
                    {formatCustomerDisplayName(item.shopName, item.shopkeeperName)}
                  </Text>
                  <Text style={[styles.shopSub, { color: theme.textMuted }]}>
                    {item.shopkeeperName && item.shopkeeperName !== item.shopName ? `${item.shopkeeperName} • ` : ''}📍 {item.city} ({item.area || 'All Areas'})
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.balanceValue,
                      { color: hasDue ? theme.danger : theme.success },
                    ]}
                  >
                    {hasDue ? `Rs. ${Number(item.remainingBalance || 0).toLocaleString()}` : 'Settled'}
                  </Text>
                  <Text style={[styles.balanceLabel, { color: theme.textMuted }]}>Khata Balance</Text>
                </View>
              </View>

              {/* Card Actions */}
              <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <Text style={[styles.phoneText, { color: theme.textSecondary }]}>📞 {item.phone || 'No Contact'}</Text>

                <Pressable
                  onPress={() => handleOpenWasooli(item)}
                  style={[styles.wasooliBtn, { backgroundColor: theme.success }]}
                >
                  <Text style={styles.wasooliBtnText}>💰 Wasooli Receipt</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32 }}>💰</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No shopkeepers found on this route</Text>
          </View>
        }
      />

      {/* Wasooli Record Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Receive Payment (Wasooli)</Text>
              <Pressable
                onPress={() => setPaymentModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.surfaceMuted, borderRadius: 15 }]}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <View
                style={[
                  styles.targetShopBox,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.targetShopName, { color: theme.textPrimary }]}>{targetCust?.shopName}</Text>
                <Text style={[styles.targetShopOwner, { color: theme.textSecondary }]}>
                  {targetCust?.shopkeeperName} • {targetCust?.city}
                </Text>
                <Text style={[styles.targetShopDue, { color: theme.danger }]}>
                  Pending Khata Baqaya: Rs. {Number(targetCust?.remainingBalance || 0).toLocaleString()}
                </Text>
              </View>

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Wasooli Amount (Rs.) *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={wasooliAmount}
                onChangeText={setWasooliAmount}
                placeholder="e.g. 50000"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Payment Method</Text>
              <View style={styles.methodRow}>
                {(['Cash', 'Online / Bank', 'Cheque'] as const).map((mode) => (
                  <Pressable
                    key={mode}
                    onPress={() => setPaymentMode(mode)}
                    style={[
                      styles.methodChip,
                      {
                        backgroundColor: paymentMode === mode ? theme.brandBlue : theme.surfaceMuted,
                        borderColor: paymentMode === mode ? theme.brandBlue : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.methodText,
                        { color: paymentMode === mode ? '#ffffff' : theme.textPrimary },
                        paymentMode === mode && styles.methodTextActive,
                      ]}
                    >
                      {mode}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
              <Pressable
                onPress={() => setPaymentModalVisible(false)}
                style={[
                  styles.modalCancelBtn,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleRecordPayment}
                style={[styles.modalSaveBtn, { backgroundColor: theme.success }]}
              >
                <Text style={styles.modalSaveText}>Record Wasooli</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    padding: 12,
    borderBottomWidth: 1,
  },
  routeLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  routeScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  routeChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  routeChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  routeChipTextActive: {
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  summaryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  summaryDue: {
    fontSize: 11,
    fontWeight: '800',
  },
  sheetCard: {
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
    alignItems: 'center',
    marginBottom: 10,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 11,
    fontWeight: '800',
  },
  shopName: {
    fontSize: 13,
    fontWeight: '800',
  },
  shopSub: {
    fontSize: 10,
    marginTop: 2,
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  balanceLabel: {
    fontSize: 9,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  phoneText: {
    fontSize: 11,
  },
  wasooliBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  wasooliBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalBody: {
    padding: 18,
  },
  targetShopBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  targetShopName: {
    fontSize: 14,
    fontWeight: '800',
  },
  targetShopOwner: {
    fontSize: 11,
    marginTop: 2,
  },
  targetShopDue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontWeight: '700',
  },
  methodRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  methodChipActive: {},
  methodText: {
    fontSize: 11,
    fontWeight: '600',
  },
  methodTextActive: {
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalSaveBtn: {
    flex: 1.5,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});
