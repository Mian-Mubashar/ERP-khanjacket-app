import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { mobileApi, OutwardRecord, Customer } from '../services/api';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const OutwardScreen: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [dispatches, setDispatches] = useState<OutwardRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<OutwardRecord | null>(null);

  // New Rawangi Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState<number>(0);
  const [formPieces, setFormPieces] = useState('50');
  const [formAmount, setFormAmount] = useState('75000');
  const [formTransport, setFormTransport] = useState('Bilal Goods Transport');

  const loadData = async () => {
    try {
      setLoading(true);
      const [d, c] = await Promise.all([
        mobileApi.getOutward(),
        mobileApi.getCustomers(),
      ]);
      setDispatches(d);
      setCustomers(c);
      if (c.length > 0) {
        setSelectedCustId(c[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDispatches = dispatches.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      (d.challanNo && d.challanNo.toLowerCase().includes(q)) ||
      (d.customerName && d.customerName.toLowerCase().includes(q)) ||
      (d.city && d.city.toLowerCase().includes(q))
    );
  });

  const handleCreateRawangi = async () => {
    const cust = customers.find((c) => c.id === selectedCustId);
    if (!cust) {
      return;
    }

    const challanNum = `CH-${Math.floor(8000 + Math.random() * 1000)}`;
    await mobileApi.createOutward({
      challanNo: challanNum,
      customerId: cust.id,
      customerName: cust.shopName,
      city: cust.city,
      totalPieces: Number(formPieces) || 0,
      totalAmount: Number(formAmount) || 0,
      transportName: formTransport,
      biltyNo: `BL-${Math.floor(1000 + Math.random() * 9000)}`,
      goodsName: 'China Winter Jackets',
      status: 'dispatched',
    });

    setModalVisible(false);
    loadData();
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await mobileApi.deleteOutward(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    }
  };

  const totalRawangiPcs = dispatches.reduce((sum, d) => sum + (d.totalPieces || 0), 0);
  const totalRawangiAmt = dispatches.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search & Actions Header */}
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
            placeholder="Search challan #, customer or city..."
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

        {/* Quick Metrics Bar */}
        <View style={styles.metricsRow}>
          <View>
            <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
              {filteredDispatches.length} Challans • {Number(totalRawangiPcs || 0).toLocaleString()} Pcs Dispatched
            </Text>
            <Text style={[styles.summarySub, { color: theme.textMuted }]}>
              Total Billed: Rs. {Number(totalRawangiAmt || 0).toLocaleString()}
            </Text>
          </View>

          <Pressable
            onPress={() => setModalVisible(true)}
            style={[styles.addBtn, { backgroundColor: theme.brandBlue }]}
          >
            <Text style={styles.addBtnText}>+ New Rawangi</Text>
          </Pressable>
        </View>
      </View>

      {/* Dispatches List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.brandBlue} />
        </View>
      ) : (
        <FlatList
          data={filteredDispatches}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.dispatchCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.challanRow}>
                    <Text style={[styles.challanNo, { color: theme.brandBlue }]}>{item.challanNo}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: theme.successLight,
                          borderColor: theme.successBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: theme.success }]}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.customerName, { color: theme.textPrimary }]}>{item.customerName}</Text>
                  <Text style={[styles.cityText, { color: theme.textSecondary }]}>
                    📍 {item.city} • 📅 {item.date}
                  </Text>
                </View>

                <View style={styles.amountBox}>
                  <Text style={[styles.piecesText, { color: theme.textPrimary }]}>{Number(item.totalPieces || 0)} Pcs</Text>
                  <Text style={[styles.amountText, { color: theme.brandBlue }]}>Rs. {Number(item.totalAmount || 0).toLocaleString()}</Text>
                </View>
              </View>

              <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                <Text style={[styles.transportText, { color: theme.textMuted }]}>
                  Cargo: {item.transportName || 'Standard Goods Bilty'}
                </Text>

                <Pressable
                  onPress={() => setDeleteTarget(item)}
                  style={[styles.deleteBtn, { backgroundColor: theme.dangerLight }]}
                >
                  <Text style={[styles.deleteBtnText, { color: theme.danger }]}>🗑 Cancel / Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32 }}>🚚</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No dispatch challans found</Text>
            </View>
          }
        />
      )}

      {/* Add Outward Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                New Maal Rawangi (Outward Challan)
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.surfaceMuted, borderRadius: 15 }]}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Select Shopkeeper / Customer *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                {customers.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() => setSelectedCustId(c.id)}
                    style={[
                      styles.custSelectChip,
                      {
                        backgroundColor: selectedCustId === c.id ? theme.brandBlue : theme.surfaceMuted,
                        borderColor: selectedCustId === c.id ? theme.brandBlue : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.custSelectText,
                        { color: selectedCustId === c.id ? '#ffffff' : theme.textPrimary },
                        selectedCustId === c.id && styles.custSelectTextActive,
                      ]}
                    >
                      {c.shopName} ({c.city})
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Total Garment Pieces *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formPieces}
                onChangeText={setFormPieces}
                placeholder="50"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Total Challan Bill Amount (Rs.) *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formAmount}
                onChangeText={setFormAmount}
                placeholder="75000"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Goods Transport / Bilty Company</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formTransport}
                onChangeText={setFormTransport}
                placeholder="e.g. Faisal Movers Goods, Bilal Transport"
                placeholderTextColor={theme.textMuted}
              />
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.border }]}>
              <Pressable
                onPress={() => setModalVisible(false)}
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
                onPress={handleCreateRawangi}
                style={[styles.modalSaveBtn, { backgroundColor: theme.brandBlue }]}
              >
                <Text style={styles.modalSaveText}>Create Rawangi Challan</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        visible={!!deleteTarget}
        title="Delete Outward Challan"
        itemName={deleteTarget?.challanNo || ''}
        itemSubtitle={`${deleteTarget?.customerName || ''} • ${deleteTarget?.totalPieces || 0} Pcs (Rs. ${Number(deleteTarget?.totalAmount || 0).toLocaleString()})`}
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
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  summarySub: {
    fontSize: 11,
    marginTop: 1,
  },
  addBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  dispatchCard: {
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  challanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  challanNo: {
    fontSize: 12,
    fontWeight: '800',
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
  customerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  cityText: {
    fontSize: 11,
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  piecesText: {
    fontSize: 14,
    fontWeight: '800',
  },
  amountText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  transportText: {
    fontSize: 10,
  },
  deleteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  deleteBtnText: {
    fontSize: 10,
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
    marginBottom: 6,
    marginTop: 10,
  },
  custSelectChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  custSelectChipActive: {},
  custSelectText: {
    fontSize: 11,
    fontWeight: '600',
  },
  custSelectTextActive: {
    fontWeight: '700',
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
