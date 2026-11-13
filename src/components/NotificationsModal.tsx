import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type NotificationType = 'dispatch' | 'payment' | 'stock' | 'shipment';
export type NotificationFilter = 'ALL' | 'WASOOLI' | 'STOCK';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  icon: string;
  amountOrPieces?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // Wasooli Notifications
  {
    id: 'notif-w1',
    type: 'payment',
    title: 'Wasooli Received (Cash)',
    description: 'Rs. 50,000 wasooli received from Hassan Raza Garments (Lahore Cantt).',
    amountOrPieces: 'Rs. 50,000',
    time: '15 mins ago',
    isRead: false,
    icon: '💰',
  },
  {
    id: 'notif-w2',
    type: 'payment',
    title: 'Wasooli Received (Bank Transfer)',
    description: 'Rs. 35,000 online wasooli deposited by Al-Madina Garments (Shah Alam).',
    amountOrPieces: 'Rs. 35,000',
    time: '2 hours ago',
    isRead: false,
    icon: '💰',
  },
  {
    id: 'notif-w3',
    type: 'payment',
    title: 'Wasooli Received (Cheque Cleared)',
    description: 'Rs. 20,000 wasooli cleared from Bismillah Jacket Centre (Sheikhupura).',
    amountOrPieces: 'Rs. 20,000',
    time: 'Yesterday',
    isRead: true,
    icon: '💰',
  },

  // Stock Alert Notifications
  {
    id: 'notif-s1',
    type: 'stock',
    title: 'Low Stock Alert (Critical)',
    description: 'China Fleece Lined Bomber Jacket has only 95 pieces left in godown.',
    amountOrPieces: '95 Pcs Left',
    time: '3 hours ago',
    isRead: false,
    icon: '⚠️',
  },
  {
    id: 'notif-s2',
    type: 'stock',
    title: 'Out of Stock Warning',
    description: 'Men Winter Puffer Jacket (Double Hood, Black XL) is now completely sold out.',
    amountOrPieces: '0 Pcs',
    time: '5 hours ago',
    isRead: false,
    icon: '⚠️',
  },
  {
    id: 'notif-s3',
    type: 'stock',
    title: 'New Stock Received in Warehouse',
    description: '350 pieces of Biker Leather Finished Jackets added to main inventory.',
    amountOrPieces: '+350 Pcs',
    time: '1 day ago',
    isRead: true,
    icon: '📦',
  },

  // Other Activity
  {
    id: 'notif-d1',
    type: 'dispatch',
    title: 'Maal Rawangi Challan Created',
    description: 'Challan # CH-8902 for 60 pcs dispatched to Hassan Ashfaq Shop (Islamabad).',
    amountOrPieces: '60 Pcs',
    time: '4 hours ago',
    isRead: true,
    icon: '🚚',
  },
  {
    id: 'notif-m1',
    type: 'shipment',
    title: 'China Container Arrived at Port',
    description: 'Container MSKU-8821940 with 1,200 pcs arrived at Karachi Port (QICT).',
    amountOrPieces: '1,200 Pcs',
    time: '2 days ago',
    isRead: true,
    icon: '🚢',
  },
];

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  onCountChange,
}) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('ALL');

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    if (onCountChange) {
      onCountChange(0);
    }
  };

  const markOneRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    const unread = updated.filter((n) => !n.isRead).length;
    if (onCountChange) {
      onCountChange(unread);
    }
  };

  const wasooliCount = notifications.filter((n) => n.type === 'payment').length;
  const stockCount = notifications.filter((n) => n.type === 'stock').length;
  const totalCount = notifications.length;
  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'WASOOLI') {
      return n.type === 'payment';
    }
    if (activeFilter === 'STOCK') {
      return n.type === 'stock';
    }
    return true;
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.sheetContainer, { backgroundColor: theme.surface }]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <View>
                <View style={styles.titleRow}>
                  <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Notifications</Text>
                  {unreadTotal > 0 ? (
                    <View style={[styles.unreadBadge, { backgroundColor: theme.dangerLight, borderColor: theme.dangerBorder }]}>
                      <Text style={[styles.unreadBadgeText, { color: theme.danger }]}>{unreadTotal} new</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
                  Real-time Wasooli & Stock alerts
                </Text>
              </View>

              <View style={styles.headerActions}>
                {unreadTotal > 0 ? (
                  <Pressable onPress={markAllRead} style={styles.markAllBtn}>
                    <Text style={[styles.markAllText, { color: theme.brandBlue }]}>Mark all read</Text>
                  </Pressable>
                ) : null}

                <Pressable
                  onPress={onClose}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceMuted }]}
                >
                  <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
                </Pressable>
              </View>
            </View>

            {/* Filter Tabs: All, Wasooli, Stock Alert */}
            <View style={[styles.tabsRow, { borderBottomColor: theme.border }]}>
              {/* All Tab */}
              <Pressable
                onPress={() => setActiveFilter('ALL')}
                style={[
                  styles.filterTab,
                  { backgroundColor: theme.surfaceMuted },
                  activeFilter === 'ALL' && { backgroundColor: theme.brandBlue },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    { color: theme.textSecondary },
                    activeFilter === 'ALL' && { color: '#ffffff', fontWeight: '800' },
                  ]}
                >
                  All ({totalCount})
                </Text>
              </Pressable>

              {/* Wasooli Tab */}
              <Pressable
                onPress={() => setActiveFilter('WASOOLI')}
                style={[
                  styles.filterTab,
                  { backgroundColor: theme.surfaceMuted },
                  activeFilter === 'WASOOLI' && { backgroundColor: theme.success },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    { color: theme.textSecondary },
                    activeFilter === 'WASOOLI' && { color: '#ffffff', fontWeight: '800' },
                  ]}
                >
                  💰 Wasooli ({wasooliCount})
                </Text>
              </Pressable>

              {/* Stock Alert Tab */}
              <Pressable
                onPress={() => setActiveFilter('STOCK')}
                style={[
                  styles.filterTab,
                  { backgroundColor: theme.surfaceMuted },
                  activeFilter === 'STOCK' && { backgroundColor: theme.warning },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    { color: theme.textSecondary },
                    activeFilter === 'STOCK' && { color: '#ffffff', fontWeight: '800' },
                  ]}
                >
                  ⚠️ Stock Alert ({stockCount})
                </Text>
              </Pressable>
            </View>

            {/* List */}
            <FlatList
              data={filteredNotifications}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isWasooli = item.type === 'payment';
                const isStock = item.type === 'stock';

                return (
                  <Pressable
                    onPress={() => markOneRead(item.id)}
                    style={[
                      styles.notifCard,
                      {
                        backgroundColor: !item.isRead ? theme.brandBlueLight : theme.surface,
                        borderColor: !item.isRead ? theme.brandBlueBorder : theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor: isWasooli
                            ? theme.successLight
                            : isStock
                            ? theme.warningLight
                            : theme.surfaceMuted,
                          borderColor: isWasooli
                            ? theme.successBorder
                            : isStock
                            ? theme.warningBorder
                            : theme.border,
                        },
                      ]}
                    >
                      <Text style={styles.iconEmoji}>{item.icon}</Text>
                    </View>

                    <View style={styles.textBox}>
                      <View style={styles.cardTopRow}>
                        <Text style={[styles.notifTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {item.amountOrPieces ? (
                          <View
                            style={[
                              styles.amountBadge,
                              {
                                backgroundColor: isWasooli
                                  ? theme.successLight
                                  : isStock
                                  ? theme.warningLight
                                  : theme.surfaceMuted,
                                borderColor: isWasooli
                                  ? theme.successBorder
                                  : isStock
                                  ? theme.warningBorder
                                  : theme.border,
                                borderWidth: 1,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.amountBadgeText,
                                {
                                  color: isWasooli
                                    ? theme.success
                                    : isStock
                                    ? theme.warning
                                    : theme.textPrimary,
                                },
                              ]}
                            >
                              {item.amountOrPieces}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>
                        {item.description}
                      </Text>

                      <View style={styles.bottomInfoRow}>
                        <Text style={[styles.notifTime, { color: theme.textMuted }]}>
                          {item.time}
                        </Text>
                        {!item.isRead ? (
                          <View style={[styles.unreadPill, { backgroundColor: theme.brandBlue }]}>
                            <Text style={styles.unreadPillText}>UNREAD</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>🔔</Text>
                  <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No notifications in this tab</Text>
                  <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
                    All updates are cleared or filtered out.
                  </Text>
                </View>
              }
            />
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '55%',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  unreadBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    padding: 14,
    paddingBottom: 30,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconEmoji: {
    fontSize: 18,
  },
  textBox: {
    flex: 1,
    marginLeft: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  amountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  amountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  notifDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  bottomInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  notifTime: {
    fontSize: 10,
  },
  unreadPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  unreadPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11,
  },
});
