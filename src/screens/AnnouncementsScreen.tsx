import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ScreenName } from '../components/SidebarDrawer';

interface AnnouncementItem {
  id: string;
  type: 'stock' | 'shipment' | 'wasooli' | 'system';
  title: string;
  description: string;
  timestamp: string;
  tag: string;
  isRead: boolean;
  actionScreen?: ScreenName;
  actionText?: string;
  icon: string;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    type: 'stock',
    title: 'Critical Low Stock Alert',
    description: 'China Fleece Lined Bomber Jacket has only 95 pieces remaining in godown. Reorder recommended.',
    timestamp: '25 mins ago',
    tag: 'Urgent Stock',
    isRead: false,
    actionScreen: 'Articles',
    actionText: 'View Stock →',
    icon: '⚠️',
  },
  {
    id: 'ann-2',
    type: 'stock',
    title: 'Article Sold Out Warning',
    description: 'Men Winter Puffer Jacket (Double Hood, Black XL) is completely out of stock in warehouse.',
    timestamp: '2 hours ago',
    tag: 'Out of Stock',
    isRead: false,
    actionScreen: 'Articles',
    actionText: 'Check Catalog →',
    icon: '📦',
  },
  {
    id: 'ann-3',
    type: 'shipment',
    title: 'China Sea Container Arrived',
    description: 'Container MSKU-8821940 with 1,200 pcs arrived at Karachi Port (QICT). Customs clearance ongoing.',
    timestamp: '5 hours ago',
    tag: 'Import Logistics',
    isRead: false,
    actionScreen: 'Purchases',
    actionText: 'View Shipment →',
    icon: '🚢',
  },
  {
    id: 'ann-4',
    type: 'wasooli',
    title: 'Daily Wasooli Milestone Reached',
    description: 'Lahore Route payment recovery exceeded Rs. 450,000 today from Shah Alam and Anarkali accounts.',
    timestamp: '1 day ago',
    tag: 'Collection Success',
    isRead: true,
    actionScreen: 'Ugrahi',
    actionText: 'Open Route Sheet →',
    icon: '💰',
  },
  {
    id: 'ann-5',
    type: 'stock',
    title: 'New Winter Stock Consignment Added',
    description: '350 pieces of Biker Leather Finished Jackets processed and tagged into central warehouse inventory.',
    timestamp: '1 day ago',
    tag: 'Inventory Update',
    isRead: true,
    actionScreen: 'Articles',
    actionText: 'View Garments →',
    icon: '🧥',
  },
  {
    id: 'ann-6',
    type: 'system',
    title: 'Portal Database & Mobile Sync Online',
    description: 'Central database backup complete. Real-time REST API synchronization active with no delays.',
    timestamp: '2 days ago',
    tag: 'System Healthy',
    isRead: true,
    actionScreen: 'Security',
    actionText: 'Check Security →',
    icon: '🛡️',
  },
];

interface AnnouncementsScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

export const AnnouncementsScreen: React.FC<AnnouncementsScreenProps> = ({ onNavigate }) => {
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [filter, setFilter] = useState<'ALL' | 'STOCK' | 'SHIPMENT' | 'WASOOLI'>('ALL');

  const filteredData = announcements.filter((item) => {
    if (filter === 'STOCK') {
      return item.type === 'stock';
    }
    if (filter === 'SHIPMENT') {
      return item.type === 'shipment';
    }
    if (filter === 'WASOOLI') {
      return item.type === 'wasooli';
    }
    return true;
  });

  const markAllRead = () => {
    setAnnouncements((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const markItemRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
    );
  };

  const unreadCount = announcements.filter((a) => !a.isRead).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Banner & Filter Strip */}
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
          <View style={styles.headerLeft}>
            <Text style={[styles.headerSub, { color: theme.brandBlue }]}>
              NOTICES & ALERTS
            </Text>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Announcements ({announcements.length})
            </Text>
            <Text style={[styles.headerDesc, { color: theme.textMuted }]}>
              Warehouse stock warnings, sea arrivals & payment updates
            </Text>
          </View>
          {unreadCount > 0 ? (
            <Pressable
              onPress={markAllRead}
              style={[styles.markReadBtn, { backgroundColor: theme.brandBlueLight }]}
            >
              <Text style={[styles.markReadText, { color: theme.brandBlue }]}>
                Mark All Read
              </Text>
            </Pressable>
          ) : null}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Pressable
            onPress={() => setFilter('ALL')}
            style={[
              styles.filterChip,
              filter === 'ALL'
                ? { backgroundColor: theme.brandBlue }
                : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'ALL' ? { color: '#ffffff', fontWeight: '700' } : { color: theme.textSecondary },
              ]}
            >
              All Notices ({announcements.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter('STOCK')}
            style={[
              styles.filterChip,
              filter === 'STOCK'
                ? { backgroundColor: theme.danger }
                : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'STOCK' ? { color: '#ffffff', fontWeight: '700' } : { color: theme.textSecondary },
              ]}
            >
              ⚠️ Stock Alerts (3)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter('SHIPMENT')}
            style={[
              styles.filterChip,
              filter === 'SHIPMENT'
                ? { backgroundColor: theme.purple }
                : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'SHIPMENT' ? { color: '#ffffff', fontWeight: '700' } : { color: theme.textSecondary },
              ]}
            >
              🚢 Shipments (1)
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter('WASOOLI')}
            style={[
              styles.filterChip,
              filter === 'WASOOLI'
                ? { backgroundColor: theme.success }
                : { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'WASOOLI' ? { color: '#ffffff', fontWeight: '700' } : { color: theme.textSecondary },
              ]}
            >
              💰 Wasooli (1)
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Announcements List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUrgent = item.type === 'stock' && !item.isRead;
          return (
            <Pressable
              onPress={() => markItemRead(item.id)}
              style={[
                styles.itemCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: isUrgent ? theme.dangerBorder : theme.border,
                },
                !item.isRead && { borderLeftWidth: 4, borderLeftColor: isUrgent ? theme.danger : theme.brandBlue },
              ]}
            >
              <View style={styles.itemHeader}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor:
                        item.type === 'stock'
                          ? theme.dangerLight
                          : item.type === 'shipment'
                          ? theme.purpleLight
                          : item.type === 'wasooli'
                          ? theme.successLight
                          : theme.brandBlueLight,
                    },
                  ]}
                >
                  <Text style={styles.iconText}>{item.icon}</Text>
                </View>

                <View style={styles.itemTitleArea}>
                  <View style={styles.tagRow}>
                    <View
                      style={[
                        styles.tagPill,
                        {
                          backgroundColor:
                            item.type === 'stock'
                              ? theme.dangerLight
                              : item.type === 'wasooli'
                              ? theme.successLight
                              : theme.surfaceMuted,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          {
                            color:
                              item.type === 'stock'
                                ? theme.danger
                                : item.type === 'wasooli'
                                ? theme.success
                                : theme.textSecondary,
                          },
                        ]}
                      >
                        {item.tag}
                      </Text>
                    </View>
                    <Text style={[styles.timestampText, { color: theme.textMuted }]}>
                      {item.timestamp}
                    </Text>
                  </View>

                  <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>
                    {item.title}
                  </Text>
                </View>
              </View>

              <Text style={[styles.itemDescription, { color: theme.textSecondary }]}>
                {item.description}
              </Text>

              {/* Action Button Row */}
              {item.actionScreen && onNavigate ? (
                <View style={[styles.itemActionRow, { borderTopColor: theme.border }]}>
                  <Pressable
                    onPress={() => {
                      markItemRead(item.id);
                      if (item.actionScreen && onNavigate) {
                        onNavigate(item.actionScreen);
                      }
                    }}
                    style={[styles.actionBtn, { backgroundColor: theme.surfaceMuted }]}
                  >
                    <Text style={[styles.actionBtnText, { color: theme.brandBlue }]}>
                      {item.actionText}
                    </Text>
                  </Pressable>
                </View>
              ) : null}
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 14,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  headerDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  markReadBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 8,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
  },
  filterScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  itemCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  itemTitleArea: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  timestampText: {
    fontSize: 10,
    fontWeight: '500',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  itemActionRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

