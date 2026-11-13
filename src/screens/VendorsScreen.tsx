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

interface Vendor {
  id: number;
  companyName: string;
  contactPerson: string;
  city: string;
  phone: string;
  currency: string;
  totalPurchased: number;
  totalPaid: number;
  balanceDue: number;
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: 1,
    companyName: 'Guangzhou Jinlong Garments Ltd',
    contactPerson: 'Mr. Chen / Agent Li',
    city: 'Guangzhou, China',
    phone: '+86 138 0013 8000',
    currency: 'USD',
    totalPurchased: 45000,
    totalPaid: 32000,
    balanceDue: 13000,
  },
  {
    id: 2,
    companyName: 'Yiwu Winter Jacket Manufacturing',
    contactPerson: 'Wang Wei',
    city: 'Yiwu, Zhejiang, China',
    phone: '+86 139 5556 7788',
    currency: 'RMB',
    totalPurchased: 180000,
    totalPaid: 180000,
    balanceDue: 0,
  },
  {
    id: 3,
    companyName: 'Shaoxing Textile & Outerwear Export',
    contactPerson: 'Lin Xiao',
    city: 'Shaoxing, China',
    phone: '+86 135 7788 9900',
    currency: 'USD',
    totalPurchased: 28000,
    totalPaid: 15000,
    balanceDue: 13000,
  },
];

export const VendorsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [vendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [search, setSearch] = useState('');

  const filtered = vendors.filter(
    (v) =>
      !search ||
      v.companyName.toLowerCase().includes(search.toLowerCase()) ||
      v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase())
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
            placeholder="Search China factory, vendor, contact..."
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
            {vendors.length} China Factory Vendors • Direct Import Accounts
          </Text>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const hasDue = item.balanceDue > 0;
          return (
            <View
              style={[
                styles.vendorCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.companyName, { color: theme.textPrimary }]}>{item.companyName}</Text>
                  <Text style={[styles.contactText, { color: theme.textSecondary }]}>
                    👤 {item.contactPerson} • 📞 {item.phone}
                  </Text>
                  <Text style={[styles.locationText, { color: theme.textMuted }]}>📍 {item.city}</Text>
                </View>

                <View style={styles.badgeBox}>
                  <Text
                    style={[
                      styles.currencyBadge,
                      {
                        backgroundColor: theme.brandBlueLight,
                        color: theme.brandBlue,
                      },
                    ]}
                  >
                    {item.currency}
                  </Text>
                </View>
              </View>

              {/* Financial Stats */}
              <View
                style={[
                  styles.figuresRow,
                  {
                    backgroundColor: theme.surfaceMuted,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={[styles.figCol, { borderRightColor: theme.border }]}>
                  <Text style={[styles.figLabel, { color: theme.textMuted }]}>TOTAL PURCHASES</Text>
                  <Text style={[styles.figVal, { color: theme.textPrimary }]}>
                    {item.currency} {item.totalPurchased.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.figCol, { borderRightColor: theme.border }]}>
                  <Text style={[styles.figLabel, { color: theme.textMuted }]}>PAID</Text>
                  <Text style={[styles.figVal, { color: theme.success }]}>
                    {item.currency} {item.totalPaid.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.figCol, { borderRightWidth: 0 }]}>
                  <Text style={[styles.figLabel, { color: theme.textMuted }]}>BALANCE DUE</Text>
                  <Text
                    style={[
                      styles.figVal,
                      { color: hasDue ? theme.danger : theme.success, fontWeight: '800' },
                    ]}
                  >
                    {hasDue ? `${item.currency} ${item.balanceDue.toLocaleString()}` : 'Settled'}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 32 }}>🏭</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No vendors found</Text>
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
  vendorCard: {
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
  companyName: {
    fontSize: 14,
    fontWeight: '800',
  },
  contactText: {
    fontSize: 11,
    marginTop: 2,
  },
  locationText: {
    fontSize: 10,
    marginTop: 2,
  },
  badgeBox: {
    alignItems: 'flex-end',
  },
  currencyBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  figuresRow: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
  },
  figCol: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    paddingHorizontal: 2,
  },
  figLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  figVal: {
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
