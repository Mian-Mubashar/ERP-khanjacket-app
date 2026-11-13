import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { PortalIcon } from './PortalIcon';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.82, 330);

export type ScreenName =
  | 'Dashboard'
  | 'Branches'
  | 'Customers'
  | 'Vendors'
  | 'Articles'
  | 'Purchases'
  | 'Clearance'
  | 'Outward'
  | 'Ugrahi'
  | 'Reports'
  | 'Announcements'
  | 'Security'
  | 'Profile';

interface SidebarDrawerProps {
  isOpen: boolean;
  currentScreen: ScreenName;
  onSelectScreen: (screen: ScreenName) => void;
  onClose: () => void;
}

export interface MenuItem {
  id: ScreenName;
  title: string;
  urduSubtitle: string;
  badge?: string;
}

export const ALL_PORTAL_MENUS: MenuItem[] = [
  { id: 'Dashboard', title: 'Dashboard', urduSubtitle: 'Overview & Statistics' },
  { id: 'Branches', title: 'Branches (Shehar)', urduSubtitle: 'Cities & Localities', badge: '12' },
  { id: 'Customers', title: 'Customers', urduSubtitle: 'Shopkeepers & Khata', badge: 'Active' },
  { id: 'Vendors', title: 'Vendors (China Factory)', urduSubtitle: 'Factory Ledger & Accounts' },
  { id: 'Articles', title: 'Articles (Garments)', urduSubtitle: 'Stock & Wholesale Rates' },
  { id: 'Purchases', title: 'China Purchases', urduSubtitle: 'Container Orders & Sea Shipments' },
  { id: 'Clearance', title: 'Khan Traders Clearance', urduSubtitle: 'Customs Duty & Consignment Bills' },
  { id: 'Outward', title: 'Outward (Maal Rawangi)', urduSubtitle: 'Dispatches & Goods Bilty' },
  { id: 'Ugrahi', title: 'Payment Collection', urduSubtitle: 'Route Wasooli Sheets', badge: 'Routes' },
  { id: 'Reports', title: 'Reports (Hisaab Kitaab)', urduSubtitle: 'Turnover & Balance Sheets' },
  { id: 'Announcements', title: 'Announcements', urduSubtitle: 'Stock Alerts & System Notices', badge: '6' },
  { id: 'Security', title: 'Security (Mobiles)', urduSubtitle: 'Device Access & Sessions' },
  { id: 'Profile', title: 'Profile', urduSubtitle: 'Admin Account & Settings' },
];

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  currentScreen,
  onSelectScreen,
  onClose,
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, opacityAnim]);

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Semi-transparent Backdrop Overlay */}
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim, backgroundColor: theme.overlay }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Sliding Drawer Container */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: theme.surface,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
          {/* Brand Header */}
          <View style={[styles.brandHeader, { backgroundColor: theme.brandDark }]}>
            <View style={styles.logoBadge}>
              <PortalIcon name="Dashboard" size={18} color="#60a5fa" />
            </View>
            <View style={styles.brandInfo}>
              <Text style={styles.brandName}>KHAN JACKET</Text>
              <Text style={styles.brandSub}>China Import & Wholesale</Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          {/* User Profile Strip */}
          <View
            style={[
              styles.userStrip,
              {
                backgroundColor: theme.surfaceMuted,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <View style={[styles.avatarCircle, { backgroundColor: theme.brandBlue }]}>
              <PortalIcon name="Profile" size={16} color="#ffffff" />
            </View>
            <View style={styles.userTextBox}>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>Admin Portal</Text>
              <Text style={[styles.userRole, { color: theme.textMuted }]}>Super User • Full Access</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor: theme.successLight,
                  borderColor: theme.successBorder,
                },
              ]}
            >
              <Text style={[styles.statusPillText, { color: theme.success }]}>Online</Text>
            </View>
          </View>

          {/* Menu Items List with Professional Vector Icons */}
          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
              ALL PORTAL MODULES ({ALL_PORTAL_MENUS.length})
            </Text>

            {ALL_PORTAL_MENUS.map((item) => {
              const isSelected = currentScreen === item.id;
              const iconColor = isSelected ? theme.brandBlue : theme.textSecondary;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    onSelectScreen(item.id);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.menuRow,
                    isSelected && {
                      backgroundColor: theme.brandBlueLight,
                      borderColor: theme.brandBlueBorder,
                      borderWidth: 1,
                    },
                    pressed && { backgroundColor: theme.surfaceMuted },
                  ]}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: isSelected ? theme.surface : theme.surfaceMuted },
                    ]}
                  >
                    <PortalIcon name={item.id} size={18} color={iconColor} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text
                      style={[
                        styles.menuTitle,
                        { color: isSelected ? theme.brandBlue : theme.textPrimary },
                        isSelected && { fontWeight: '800' },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.menuSubtitle, { color: theme.textMuted }]}>
                      {item.urduSubtitle}
                    </Text>
                  </View>
                  {item.badge ? (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isSelected ? theme.brandBlue : theme.surfaceMuted,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isSelected ? '#ffffff' : theme.textSecondary },
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Drawer Footer */}
          <View
            style={[
              styles.drawerFooter,
              {
                borderTopColor: theme.border,
                backgroundColor: theme.surfaceMuted,
              },
            ]}
          >
            <Text style={[styles.footerBrand, { color: theme.textSecondary }]}>
              Khan Clothes ERP v2.0
            </Text>
            <Text style={[styles.footerNote, { color: theme.textMuted }]}>
              All 13 Modules Synchronized with Central SQL
            </Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  safeArea: {
    flex: 1,
  },
  brandHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
  },
  brandInfo: {
    flex: 1,
    marginLeft: 10,
  },
  brandName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandSub: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  userStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTextBox: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
  },
  userRole: {
    fontSize: 10,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 3,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 9,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  drawerFooter: {
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 11,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 9,
    marginTop: 2,
  },
});
