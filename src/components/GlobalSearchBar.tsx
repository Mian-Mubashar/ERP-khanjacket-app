import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { mobileApi, Customer, Article, OutwardRecord, CityRecord } from '../services/api';
import { ScreenName } from './SidebarDrawer';

interface GlobalSearchBarProps {
  onNavigate: (screen: ScreenName) => void;
}

type SearchCategory = 'ALL' | 'ARTICLES' | 'CUSTOMERS' | 'CHALLANS' | 'CITIES';

interface SearchResultItem {
  id: string;
  type: 'article' | 'customer' | 'challan' | 'city';
  title: string;
  subtitle: string;
  extraBadge: string;
  targetScreen: ScreenName;
  icon: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ALL');

  // Datasets for global search
  const [articles, setArticles] = useState<Article[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [outward, setOutward] = useState<OutwardRecord[]>([]);
  const [cities, setCities] = useState<CityRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [arts, custs, outw, cits] = await Promise.all([
        mobileApi.getArticles(),
        mobileApi.getCustomers(),
        mobileApi.getOutward(),
        mobileApi.getCities(),
      ]);
      setArticles(arts);
      setCustomers(custs);
      setOutward(outw);
      setCities(cits);
    };
    fetchData();
  }, [modalVisible]);

  // Compute Search Results Across Entire App
  const getResults = (): SearchResultItem[] => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return [];
    }

    const results: SearchResultItem[] = [];

    // 1. Articles Search
    if (activeCategory === 'ALL' || activeCategory === 'ARTICLES') {
      articles.forEach((a) => {
        if (
          a.articleNo.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.color && a.color.toLowerCase().includes(q))
        ) {
          results.push({
            id: `art-${a.id}`,
            type: 'article',
            title: `${a.articleNo} - ${a.name}`,
            subtitle: `${a.category} • Wholesale: Rs. ${a.unitPrice.toLocaleString()}`,
            extraBadge: `${a.currentStock} Pcs Stock`,
            targetScreen: 'Articles',
            icon: '📦',
          });
        }
      });
    }

    // 2. Customers Search (Shop Name, Owner Name, City, Phone)
    if (activeCategory === 'ALL' || activeCategory === 'CUSTOMERS') {
      customers.forEach((c) => {
        if (
          c.shopName.toLowerCase().includes(q) ||
          c.shopkeeperName.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          (c.area && c.area.toLowerCase().includes(q)) ||
          (c.phone && c.phone.includes(q))
        ) {
          const hasDue = c.remainingBalance > 0;
          results.push({
            id: `cust-${c.id}`,
            type: 'customer',
            title: c.shopName,
            subtitle: `${c.shopkeeperName} • ${c.city}${c.area ? ` (${c.area})` : ''} • ${c.phone || ''}`,
            extraBadge: hasDue ? `Due: Rs. ${c.remainingBalance.toLocaleString()}` : 'Settled',
            targetScreen: 'Customers',
            icon: '👥',
          });
        }
      });
    }

    // 3. Challans / Outward Dispatches
    if (activeCategory === 'ALL' || activeCategory === 'CHALLANS') {
      outward.forEach((o) => {
        if (
          o.challanNo.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          (o.biltyNo && o.biltyNo.toLowerCase().includes(q)) ||
          (o.goodsName && o.goodsName.toLowerCase().includes(q))
        ) {
          results.push({
            id: `out-${o.id}`,
            type: 'challan',
            title: `${o.challanNo} - ${o.customerName}`,
            subtitle: `${o.totalPieces} Pcs • Rs. ${o.totalAmount.toLocaleString()} • ${o.city} • Bilty: ${o.biltyNo || 'N/A'}`,
            extraBadge: o.status.toUpperCase(),
            targetScreen: 'Outward',
            icon: '🚚',
          });
        }
      });
    }

    // 4. Cities / Branches Search
    if (activeCategory === 'ALL' || activeCategory === 'CITIES') {
      cities.forEach((city) => {
        if (
          city.name.toLowerCase().includes(q) ||
          (city.province && city.province.toLowerCase().includes(q))
        ) {
          results.push({
            id: `city-${city.id}`,
            type: 'city',
            title: city.province ? `${city.name} (${city.province})` : city.name,
            subtitle: `${city.shopsCount} Shops registered in this city/branch`,
            extraBadge: 'Branch',
            targetScreen: 'Branches',
            icon: '📍',
          });
        }
      });
    }

    return results;
  };

  const searchResults = getResults();

  const handleSelectItem = (item: SearchResultItem) => {
    setModalVisible(false);
    setSearchTerm('');
    onNavigate(item.targetScreen);
  };

  return (
    <>
      {/* Top Header Persistent Search Bar Trigger */}
      <View style={styles.searchBarWrapper}>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [styles.triggerBox, pressed && styles.triggerBoxPressed]}
        >
          <View style={styles.searchIconCircle}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
          <Text style={styles.triggerPlaceholder}>
            Search Article, Shopkeeper / Khata, Challan #...
          </Text>
          <View style={styles.quickShortcut}>
            <Text style={styles.quickShortcutText}>Ctrl+K</Text>
          </View>
        </Pressable>
      </View>

      {/* Full-Screen Fast Global Search Overlay Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: theme.background }]}>
          {/* Top Search Input Row */}
          <View style={[styles.modalHeaderBar, { backgroundColor: theme.brandDark }]}>
            <View style={styles.modalInputRow}>
              <Text style={styles.modalSearchIcon}>🔍</Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder="Type article, customer, phone, challan #..."
                placeholderTextColor="#94a3b8"
                autoFocus
                value={searchTerm}
                onChangeText={setSearchTerm}
              />
              {searchTerm ? (
                <Pressable onPress={() => setSearchTerm('')} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>✕</Text>
                </Pressable>
              ) : null}
            </View>

            <Pressable
              onPress={() => {
                setModalVisible(false);
                setSearchTerm('');
              }}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>

          {/* Quick Scope Filter Chips */}
          <View
            style={[
              styles.filterBar,
              { backgroundColor: theme.surface, borderBottomColor: theme.border },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {[
                { id: 'ALL', label: 'All Items' },
                { id: 'ARTICLES', label: 'Articles 📦' },
                { id: 'CUSTOMERS', label: 'Shopkeepers 👥' },
                { id: 'CHALLANS', label: 'Challans 🚚' },
                { id: 'CITIES', label: 'Cities 📍' },
              ].map((tab) => {
                const isSelected = activeCategory === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setActiveCategory(tab.id as SearchCategory)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? theme.brandBlue : theme.surfaceMuted,
                        borderColor: isSelected ? theme.brandBlue : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isSelected ? '#ffffff' : theme.textSecondary },
                        isSelected && { fontWeight: '700' },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Search Results List */}
          {searchTerm.trim().length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconCircle, { backgroundColor: theme.brandBlueLight }]}>
                <Text style={{ fontSize: 32 }}>🔍</Text>
              </View>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Universal Global Search</Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                Type any Article code (e.g. JKT-101), Customer name, Phone number, or Challan #.
              </Text>

              {/* Suggestions / Shortcuts */}
              <View style={styles.suggestionsBox}>
                <Text style={styles.suggestionsTitle}>POPULAR SEARCHES:</Text>
                <View style={styles.suggestionsWrap}>
                  {['Puffer Jacket', 'Hassan Raza', 'Lahore', 'CH-8901', 'Islamabad', 'Leather'].map(
                    (s) => (
                      <Pressable
                        key={s}
                        onPress={() => setSearchTerm(s)}
                        style={[
                          styles.suggestionTag,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text style={[styles.suggestionTagText, { color: theme.brandBlue }]}>{s}</Text>
                      </Pressable>
                    )
                  )}
                </View>
              </View>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 32 }}>😕</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Matching Records</Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                No articles, customers, or challans found matching "{searchTerm}".
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 14, paddingBottom: 40 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelectItem(item)}
                  style={({ pressed }) => [
                    styles.resultCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                    },
                    pressed && { backgroundColor: theme.brandBlueLight },
                  ]}
                >
                  <View style={[styles.resultIconBox, { backgroundColor: theme.surfaceMuted }]}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.resultTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={[styles.resultSubtitle, { color: theme.textMuted }]} numberOfLines={1}>
                      {item.subtitle}
                    </Text>
                  </View>

                  <View style={styles.badgeBox}>
                    <Text
                      style={[
                        styles.resultBadge,
                        item.type === 'customer' && item.extraBadge.includes('Due')
                          ? { backgroundColor: theme.dangerLight, color: theme.danger }
                          : { backgroundColor: theme.brandBlueLight, color: theme.brandBlue },
                      ]}
                    >
                      {item.extraBadge}
                    </Text>
                    <Text style={[styles.navArrow, { color: theme.textMuted }]}>Tap to open →</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchBarWrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 2,
  },
  triggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  triggerBoxPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  searchIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchIcon: {
    fontSize: 12,
  },
  triggerPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  quickShortcut: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  quickShortcutText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  modalInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalSearchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  modalTextInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelBtnText: {
    color: '#60a5fa',
    fontSize: 13,
    fontWeight: '700',
  },
  filterBar: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  suggestionsBox: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  suggestionsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  suggestionTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  suggestionTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  resultIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  badgeBox: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  resultBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  navArrow: {
    fontSize: 9,
    marginTop: 3,
  },
});
