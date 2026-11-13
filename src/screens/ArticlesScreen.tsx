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
import { mobileApi, Article } from '../services/api';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

export const ArticlesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  // Edit / Add modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formArtNo, setFormArtNo] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Puffer Jacket');
  const [formStock, setFormStock] = useState('100');
  const [formPrice, setFormPrice] = useState('1500');

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await mobileApi.getArticles();
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(articles.map((a) => a.category || 'General')))];

  const filteredArticles = articles.filter((a) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (a.articleNo && a.articleNo.toLowerCase().includes(q)) ||
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.category && a.category.toLowerCase().includes(q));

    if (!matchesSearch) {
      return false;
    }
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setFormArtNo(art.articleNo);
    setFormName(art.name);
    setFormCategory(art.category);
    setFormStock(String(art.currentStock));
    setFormPrice(String(art.unitPrice));
    setModalVisible(true);
  };

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormArtNo(`JKT-${Math.floor(100 + Math.random() * 900)}`);
    setFormName('');
    setFormCategory('Puffer Jacket');
    setFormStock('100');
    setFormPrice('1500');
    setModalVisible(true);
  };

  const handleSaveArticle = async () => {
    if (!formArtNo.trim() || !formName.trim()) {
      return;
    }

    if (editingArticle) {
      await mobileApi.updateArticle(editingArticle.id, {
        articleNo: formArtNo,
        name: formName,
        category: formCategory,
        currentStock: Number(formStock) || 0,
        unitPrice: Number(formPrice) || 0,
      });
    } else {
      await mobileApi.addArticle({
        articleNo: formArtNo,
        name: formName,
        category: formCategory,
        color: 'Black / Navy',
        sizes: ['M', 'L', 'XL'],
        unitPrice: Number(formPrice) || 0,
        currentStock: Number(formStock) || 0,
        initialStock: Number(formStock) || 0,
      });
    }

    setModalVisible(false);
    loadArticles();
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await mobileApi.deleteArticle(deleteTarget.id);
      setDeleteTarget(null);
      loadArticles();
    }
  };

  const totalStockPieces = articles.reduce((sum, a) => sum + (a.currentStock || 0), 0);

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
            placeholder="Search article # or name..."
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

        {/* Categories Bar & Add Button */}
        <View style={styles.catRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected ? theme.brandBlue : theme.surfaceMuted,
                      borderColor: isSelected ? theme.brandBlue : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: isSelected ? '#ffffff' : theme.textSecondary },
                      isSelected && styles.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            onPress={handleOpenAdd}
            style={[styles.addBtn, { backgroundColor: theme.brandBlue }]}
          >
            <Text style={styles.addBtnText}>+ Add Article</Text>
          </Pressable>
        </View>

        {/* Stock Summary Strip */}
        <View style={[styles.summaryBar, { borderTopColor: theme.border }]}>
          <Text style={[styles.summaryText, { color: theme.textMuted }]}>
            Showing <Text style={{ fontWeight: '800', color: theme.textPrimary }}>{filteredArticles.length}</Text> Articles
          </Text>
          <Text style={[styles.summaryStock, { color: theme.success }]}>
            Warehouse Stock: <Text style={{ fontWeight: '800' }}>{Number(totalStockPieces || 0).toLocaleString()} Pcs</Text>
          </Text>
        </View>
      </View>

      {/* Articles List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.brandBlue} />
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
          renderItem={({ item }) => {
            const isLowStock = item.currentStock < 50;
            return (
              <View
                style={[
                  styles.articleCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.artNoRow}>
                      <Text
                        style={[
                          styles.artNoBadge,
                          {
                            backgroundColor: theme.brandBlueLight,
                            color: theme.brandBlue,
                          },
                        ]}
                      >
                        {item.articleNo}
                      </Text>
                      <Text
                        style={[
                          styles.categoryBadge,
                          {
                            backgroundColor: theme.surfaceMuted,
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        {item.category}
                      </Text>
                    </View>
                    <Text style={[styles.artName, { color: theme.textPrimary }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.stockPill,
                      {
                        backgroundColor: isLowStock ? theme.warningLight : theme.successLight,
                        borderColor: isLowStock ? theme.warningBorder : theme.successBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockPillText,
                        { color: isLowStock ? theme.warning : theme.success },
                      ]}
                    >
                      {item.currentStock} Pcs
                    </Text>
                    <Text style={[styles.stockLabel, { color: theme.textMuted }]}>Available</Text>
                  </View>
                </View>

                {/* Attributes Row */}
                <View
                  style={[
                    styles.attributesRow,
                    {
                      backgroundColor: theme.surfaceMuted,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.attrCol}>
                    <Text style={[styles.attrLabel, { color: theme.textMuted }]}>WHOLESALE RATE</Text>
                    <Text style={[styles.attrVal, { color: theme.textPrimary }]}>
                      Rs. {Number(item.unitPrice || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.attrCol}>
                    <Text style={[styles.attrLabel, { color: theme.textMuted }]}>TOTAL VALUE</Text>
                    <Text style={[styles.attrVal, { color: theme.brandBlue }]}>
                      Rs. {(Number(item.currentStock || 0) * Number(item.unitPrice || 0)).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.attrCol}>
                    <Text style={[styles.attrLabel, { color: theme.textMuted }]}>STATUS</Text>
                    <Text
                      style={[
                        styles.attrVal,
                        { color: isLowStock ? theme.danger : theme.success },
                      ]}
                    >
                      {isLowStock ? 'Low Stock' : 'In Stock'}
                    </Text>
                  </View>
                </View>

                {/* Actions & Color/Sizes Row */}
                <View style={[styles.cardActionsRow, { borderTopColor: theme.border }]}>
                  <Text style={[styles.colorsText, { color: theme.textMuted }]} numberOfLines={2}>
                    Colors: {item.color || 'Standard'} • Sizes: {Array.isArray(item.sizes) ? item.sizes.join(', ') : String(item.sizes || 'All')}
                  </Text>

                  <View style={styles.actionBtnGroup}>
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
              <Text style={{ fontSize: 32 }}>🧥</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No garments found</Text>
            </View>
          }
        />
      )}

      {/* Edit / Add Modal */}
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
                {editingArticle ? 'Edit Article Details' : 'Add New Garment Article'}
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: theme.surfaceMuted, borderRadius: 15 }]}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textSecondary }}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Article # Code *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formArtNo}
                onChangeText={setFormArtNo}
                placeholder="e.g. JKT-201, BOMBER-99"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Garment Article Name *</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formName}
                onChangeText={setFormName}
                placeholder="e.g. Mens Winter Puffer Jacket"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Category</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formCategory}
                onChangeText={setFormCategory}
                placeholder="e.g. Puffer Jacket, Bomber, Leather"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Current Stock (Pieces)</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formStock}
                onChangeText={setFormStock}
                placeholder="100"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Wholesale Unit Rate (Rs.)</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  },
                ]}
                value={formPrice}
                onChangeText={setFormPrice}
                placeholder="1500"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
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
                onPress={handleSaveArticle}
                style={[styles.modalSaveBtn, { backgroundColor: theme.brandBlue }]}
              >
                <Text style={styles.modalSaveText}>
                  {editingArticle ? 'Save Changes' : 'Create Article'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        visible={!!deleteTarget}
        title="Delete Article"
        itemName={deleteTarget?.name || ''}
        itemSubtitle={`Code: ${deleteTarget?.articleNo} • Stock: ${deleteTarget?.currentStock} Pcs`}
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
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  catChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  catChipTextActive: {
    fontWeight: '700',
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
  summaryStock: {
    fontSize: 11,
  },
  articleCard: {
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
  artNoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  artNoBadge: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  artName: {
    fontSize: 13,
    fontWeight: '700',
  },
  stockPill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  stockPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  stockLabel: {
    fontSize: 9,
    marginTop: 1,
  },
  attributesRow: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  attrCol: {
    flex: 1,
  },
  attrLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  attrVal: {
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
  colorsText: {
    flex: 1,
    fontSize: 10,
    marginRight: 8,
  },
  actionBtnGroup: {
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
