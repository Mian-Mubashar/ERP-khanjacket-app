import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { mobileApi, CityRecord } from '../services/api';

export const BranchesScreen: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<CityRecord[]>([]);
  const [search, setSearch] = useState('');

  const loadCities = async () => {
    try {
      setLoading(true);
      const data = await mobileApi.getCities();
      setCities(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const filteredCities = cities.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return true;
    }
    return (
      c.name.toLowerCase().includes(q) ||
      c.areas.some((a) => a.toLowerCase().includes(q))
    );
  });

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
            placeholder="Search city or area name..."
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
            {cities.length} Branches Registered • Distribution Hubs
          </Text>
        </View>
      </View>

      {/* Cities List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.brandBlue} />
        </View>
      ) : (
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.cityCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.cityNameRow}>
                    <Text style={styles.cityIcon}>📍</Text>
                    <Text style={[styles.cityName, { color: theme.textPrimary }]}>{item.name}</Text>
                  </View>
                </View>

                <View style={styles.statsBox}>
                  <View style={[styles.statPill, { backgroundColor: theme.surfaceMuted }]}>
                    <Text style={[styles.statText, { color: theme.textSecondary }]}>{item.shopsCount} Shops</Text>
                  </View>
                  <View style={[styles.statPill, { backgroundColor: theme.brandBlueLight }]}>
                    <Text style={[styles.statText, { color: theme.brandBlue }]}>
                      {item.totalPieces} Pcs
                    </Text>
                  </View>
                </View>
              </View>

              {/* Areas Tags */}
              <View style={[styles.areasContainer, { borderTopColor: theme.border }]}>
                <Text style={[styles.areasLabel, { color: theme.textMuted }]}>AREAS / LOCALITIES:</Text>
                <View style={styles.tagsWrapper}>
                  {item.areas.length > 0 ? (
                    item.areas.map((area, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.areaTag,
                          {
                            backgroundColor: theme.surfaceMuted,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text style={[styles.areaTagText, { color: theme.textSecondary }]}>{area}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={[styles.noAreasText, { color: theme.textMuted }]}>No areas assigned yet</Text>
                  )}
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 32 }}>📍</Text>
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No branch cities found</Text>
            </View>
          }
        />
      )}
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
  summaryRow: {
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  cityCard: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '800',
  },
  statsBox: {
    flexDirection: 'row',
    gap: 6,
  },
  statPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statText: {
    fontSize: 10,
    fontWeight: '700',
  },
  areasContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
  },
  areasLabel: {
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  areaTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  areaTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  noAreasText: {
    fontSize: 11,
    fontStyle: 'italic',
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
