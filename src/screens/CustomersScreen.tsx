import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { mobileApi, Customer } from '../services/api';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { formatCustomerDisplayName } from '../utils/formatters';

export const CustomersScreen: React.FC = () => {
  const { theme } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>(() => mobileApi.getCustomersSync());
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'DUE' | 'SETTLED'>('ALL');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  // Edit / Add modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formShopName, setFormShopName] = useState('');
  const [formOwnerName, setFormOwnerName] = useState('');
  const [formCity, setFormCity] = useState('Lahore');
  const [formArea, setFormArea] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBalance, setFormBalance] = useState('');

  const loadCustomers = async () => {
    try {
      const data = await mobileApi.getCustomers();
      setCustomers(data);
    } catch {
      // Keep reactive store
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (c.shopName && c.shopName.toLowerCase().includes(query)) ||
      (c.shopkeeperName && c.shopkeeperName.toLowerCase().includes(query)) ||
      (c.city && c.city.toLowerCase().includes(query)) ||
      (c.phone && c.phone.includes(query));

    if (!matchesSearch) {
      return false;
    }

    if (filterTab === 'DUE') {
      return c.remainingBalance > 0;
    }
    if (filterTab === 'SETTLED') {
      return c.remainingBalance <= 0;
    }
    return true;
  });

  // Open Edit Modal
  const handleOpenEdit = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormShopName(cust.shopName);
    setFormOwnerName(cust.shopkeeperName);
    setFormCity(cust.city);
    setFormArea(cust.area || '');
    setFormPhone(cust.phone || '');
    setFormBalance(String(cust.remainingBalance || 0));
    setEditModalVisible(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormShopName('');
    setFormOwnerName('');
    setFormCity('Lahore');
    setFormArea('');
    setFormPhone('');
    setFormBalance('0');
    setEditModalVisible(true);
  };

  // Save Customer (Add / Update)
  const handleSaveCustomer = async () => {
    if (!formShopName.trim()) {
      return;
    }

    if (editingCustomer) {
      // Update
      await mobileApi.updateCustomer(editingCustomer.id, {
        shopName: formShopName,
        shopkeeperName: formOwnerName,
        city: formCity,
        area: formArea,
        phone: formPhone,
        remainingBalance: Number(formBalance) || 0,
      });
    } else {
      // Add
      await mobileApi.addCustomer({
        shopName: formShopName,
        shopkeeperName: formOwnerName,
        city: formCity,
        area: formArea,
        phone: formPhone,
        remainingBalance: Number(formBalance) || 0,
        inUgrahi: true,
        ugrahiRoute: formCity,
      });
    }

    setEditModalVisible(false);
    loadCustomers();
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await mobileApi.deleteCustomer(deleteTarget.id);
      setDeleteTarget(null);
      loadCustomers();
    }
  };

  const totalBaqaya = customers.reduce((sum, c) => sum + (c.remainingBalance || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Search & Filter Bar */}
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
            placeholder="Search shop, owner, city or phone..."
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

        {/* Filter Chips & Action Row */}
        <View style={styles.filterRow}>
          <View style={styles.tabGroup}>
            <Pressable
              onPress={() => setFilterTab('ALL')}
              style={[
                styles.tabChip,
                {
                  backgroundColor: filterTab === 'ALL' ? theme.brandBlue : theme.surfaceMuted,
                  borderColor: filterTab === 'ALL' ? theme.brandBlue : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabChipText,
                  { color: filterTab === 'ALL' ? '#ffffff' : theme.textSecondary },
                  filterTab === 'ALL' && styles.tabChipTextActive,
                ]}
              >
                All ({customers.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilterTab('DUE')}
              style={[
                styles.tabChip,
                {
                  backgroundColor: filterTab === 'DUE' ? theme.brandBlue : theme.surfaceMuted,
                  borderColor: filterTab === 'DUE' ? theme.brandBlue : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabChipText,
                  { color: filterTab === 'DUE' ? '#ffffff' : theme.textSecondary },
                  filterTab === 'DUE' && styles.tabChipTextActive,
                ]}
              >
                Due Baqaya
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setFilterTab('SETTLED')}
              style={[
                styles.tabChip,
                {
                  backgroundColor: filterTab === 'SETTLED' ? theme.brandBlue : theme.surfaceMuted,
                  borderColor: filterTab === 'SETTLED' ? theme.brandBlue : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabChipText,
                  { color: filterTab === 'SETTLED' ? '#ffffff' : theme.textSecondary },
                  filterTab === 'SETTLED' && styles.tabChipTextActive,
                ]}
              >
                Settled
              </Text>
            </Pressable>
          </View>

          {/* Add Customer Button */}
          <Pressable
            onPress={handleOpenAdd}
            style={[styles.addBtn, { backgroundColor: theme.brandBlue }]}
          >
            <Text style={styles.addBtnText}>+ Add Shop</Text>
          </Pressable>
        </View>

        {/* Khata Summary Bar */}
        <View style={[styles.summaryBar, { borderTopColor: theme.border }]}>
          <Text style={[styles.summaryText, { color: theme.textMuted }]}>
            Showing <Text style={{ fontWeight: '800', color: theme.textPrimary }}>{filteredCustomers.length}</Text> Shops
          </Text>
          <Text style={[styles.summaryDue, { color: theme.danger }]}>
            Total Baqaya: <Text style={{ fontWeight: '800' }}>Rs. {totalBaqaya.toLocaleString()}</Text>
          </Text>
        </View>
      </View>

      {/* Customer List */}
      <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const hasDue = item.remainingBalance > 0;
            return (
              <View
                style={[
                  styles.customerCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* Card Top Row */}
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.shopName, { color: theme.textPrimary }]} numberOfLines={1}>
                      {formatCustomerDisplayName(item.shopName, item.shopkeeperName)}
                    </Text>
                    <Text style={[styles.shopOwner, { color: theme.textSecondary }]}>
                      {item.shopkeeperName && item.shopkeeperName !== item.shopName ? `${item.shopkeeperName} • ` : ''}{item.phone || 'No phone'}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.badgeLocation,
                      {
                        backgroundColor: theme.brandBlueLight,
                        borderColor: theme.brandBlueBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeCityText, { color: theme.brandBlue }]}>{item.city}</Text>
                    {item.area ? <Text style={[styles.badgeAreaText, { color: theme.brandBlue }]}>, {item.area}</Text> : null}
                  </View>
                </View>

                {/* Khata Financial Figures Row */}
                <View
                  style={[
                    styles.figuresRow,
                    {
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={[styles.figureBox, { borderRightColor: theme.border }]}>
                    <Text style={[styles.figureLabel, { color: theme.textMuted }]}>MAL SENT</Text>
                    <Text style={[styles.figureValue, { color: theme.textPrimary }]}>{Number(item.totalPieces || 0)} Pcs</Text>
                  </View>

                  <View style={[styles.figureBox, { borderRightColor: theme.border }]}>
                    <Text style={[styles.figureLabel, { color: theme.textMuted }]}>TOTAL BILL</Text>
                    <Text style={[styles.figureValue, { color: theme.textPrimary }]}>Rs. {Number(item.totalBilled || 0).toLocaleString()}</Text>
                  </View>

                  <View style={[styles.figureBox, { borderRightColor: theme.border }]}>
                    <Text style={[styles.figureLabel, { color: theme.textMuted }]}>WASOOLI</Text>
                    <Text style={[styles.figureValue, { color: theme.success }]}>
                      Rs. {Number(item.totalPaid || 0).toLocaleString()}
                    </Text>
                  </View>

                  <View style={[styles.figureBox, { borderRightWidth: 0 }]}>
                    <Text style={[styles.figureLabel, { color: theme.textMuted }]}>BAQAYA</Text>
                    <Text
                      style={[
                        styles.figureValue,
                        { color: hasDue ? theme.danger : theme.success, fontWeight: '800' },
                      ]}
                    >
                      {hasDue ? `Rs. ${Number(item.remainingBalance || 0).toLocaleString()}` : 'Settled'}
                    </Text>
                  </View>
                </View>

                {/* Edit & Delete Action Buttons Row */}
                <View style={[styles.cardActionsRow, { borderTopColor: theme.border }]}>
                  <Text style={[styles.khataIdText, { color: theme.textMuted }]}>ID: CUST-{item.id}</Text>

                  <View style={styles.actionsGroup}>
                    {/* Edit Button */}
                    <Pressable
                      onPress={() => handleOpenEdit(item)}
                      style={[
                        styles.editBtn,
                        {
                          backgroundColor: theme.brandBlueLight,
                          borderColor: theme.brandBlueBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.editBtnText, { color: theme.brandBlue }]}>✎ Edit</Text>
                    </Pressable>

                    {/* Delete Button */}
                    <Pressable
                      onPress={() => setDeleteTarget(item)}
                      style={[
                        styles.deleteBtn,
                        {
                          backgroundColor: theme.dangerLight,
                          borderColor: theme.dangerBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.deleteBtnText, { color: theme.danger }]}>🗑 Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32 }}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No shopkeepers found</Text>
              <Text style={[styles.emptySub, { color: theme.textMuted }]}>Try adjusting your search query or filter tab.</Text>
            </View>
          }
        />

      {/* Edit / Add Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                {editingCustomer ? 'Edit Shopkeeper Details' : 'Add New Shopkeeper'}
              </Text>
              <Pressable
                onPress={() => setEditModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.surfaceMuted, borderRadius: 15 }]}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Shop / Firm Name *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formShopName}
                onChangeText={setFormShopName}
                placeholder="e.g. Al-Madina Garments"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Shopkeeper / Owner Name *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formOwnerName}
                onChangeText={setFormOwnerName}
                placeholder="e.g. Haji Rafiq, Bhai Akram"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>City / Branch</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formCity}
                onChangeText={setFormCity}
                placeholder="e.g. Lahore, Islamabad, Karachi"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Area / Locality</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formArea}
                onChangeText={setFormArea}
                placeholder="e.g. Cantt, Shah Alam, Raja Bazaar"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Mobile / WhatsApp Number</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formPhone}
                onChangeText={setFormPhone}
                placeholder="0300-1234567"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Opening Balance / Previous Due (Rs.)</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formBalance}
                onChangeText={setFormBalance}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
              <Pressable
                onPress={() => setEditModalVisible(false)}
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
                onPress={handleSaveCustomer}
                style={[styles.modalSaveBtn, { backgroundColor: theme.brandBlue }]}
              >
                <Text style={styles.modalSaveText}>
                  {editingCustomer ? 'Save Changes' : 'Register Customer'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Safe Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={!!deleteTarget}
        title="Delete Customer"
        itemName={deleteTarget?.shopName || ''}
        itemSubtitle={`${deleteTarget?.shopkeeperName} • ${deleteTarget?.city}`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tabGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  tabChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  tabChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabChipTextActive: {
    fontWeight: '700',
  },
  addBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  summaryText: {
    fontSize: 11,
  },
  summaryDue: {
    fontSize: 11,
  },
  customerCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '800',
  },
  shopOwner: {
    fontSize: 11,
    marginTop: 2,
  },
  badgeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeCityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeAreaText: {
    fontSize: 10,
  },
  figuresRow: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 10,
    borderWidth: 1,
  },
  figureBox: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    paddingHorizontal: 2,
  },
  figureLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  figureValue: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  khataIdText: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
    alignItems: 'center',
  },
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  deleteBtnText: {
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
  emptySub: {
    fontSize: 11,
    marginTop: 4,
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
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
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
