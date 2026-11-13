import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ScreenName, ALL_PORTAL_MENUS } from './SidebarDrawer';
import { PortalIcon } from './PortalIcon';

interface BottomTabBarProps {
  currentScreen: ScreenName;
  onSelectScreen: (screen: ScreenName) => void;
  onOpenDrawer: () => void;
}

interface QuickTab {
  id: ScreenName;
  label: string;
}

// Exactly matching the web sidebar sequence
const PRIMARY_TABS: QuickTab[] = [
  { id: 'Dashboard', label: 'Dashboard' },
  { id: 'Branches', label: 'Branches' },
  { id: 'Customers', label: 'Customers' },
  { id: 'Vendors', label: 'Vendors' },
  { id: 'Articles', label: 'Articles' },
  { id: 'Purchases', label: 'Purchases' },
  { id: 'Clearance', label: 'Clearance' },
  { id: 'Outward', label: 'Rawangi' },
  { id: 'Ugrahi', label: 'Collection' },
  { id: 'Reports', label: 'Reports' },
  { id: 'Announcements', label: 'Alerts' },
  { id: 'Security', label: 'Security' },
  { id: 'Profile', label: 'Profile' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onSelectScreen,
  onOpenDrawer: _onOpenDrawer,
}) => {
  const { theme } = useTheme();
  const [allMenusModalVisible, setAllMenusModalVisible] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
        ]}
      >
        <View style={styles.wrapper}>
          {/* Scrollable Horizontal Tabs with Professional Outline Icons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {PRIMARY_TABS.map((tab) => {
              const isActive = currentScreen === tab.id;
              const iconColor = isActive ? theme.brandBlue : theme.textMuted;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => onSelectScreen(tab.id)}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      isActive && { backgroundColor: theme.brandBlueLight },
                    ]}
                  >
                    <PortalIcon name={tab.id} size={19} color={iconColor} />
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      { color: theme.textMuted },
                      isActive && { color: theme.brandBlue, fontWeight: '800' },
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {isActive ? (
                    <View style={[styles.activeDot, { backgroundColor: theme.brandBlue }]} />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Fixed "All Menus" Hub Button at the End */}
          <Pressable
            onPress={() => setAllMenusModalVisible(true)}
            style={[
              styles.allMenusButton,
              {
                backgroundColor: theme.surfaceMuted,
                borderLeftColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.allMenusIconBox,
                { backgroundColor: theme.brandBlue },
              ]}
            >
              <Text style={styles.allMenusIcon}>☰</Text>
            </View>
            <Text style={[styles.allMenusText, { color: theme.brandBlue }]}>
              All Menus
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Complete Portal Modules Grid Hub Modal */}
      <Modal
        visible={allMenusModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAllMenusModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
            <SafeAreaView style={styles.modalSheetInner}>
              {/* Sheet Header */}
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <View>
                  <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                    PORTAL ALL MENUS
                  </Text>
                  <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
                    All 13 modules from sidebar • Professional portal icons
                  </Text>
                </View>
                <Pressable
                  onPress={() => setAllMenusModalVisible(false)}
                  style={[styles.closeBtn, { backgroundColor: theme.surfaceMuted }]}
                >
                  <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>✕</Text>
                </Pressable>
              </View>

              {/* Grid of All 13 Portal Modules with Professional Icons */}
              <ScrollView
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
              >
                {ALL_PORTAL_MENUS.map((menu) => {
                  const isSelected = currentScreen === menu.id;
                  const iconColor = isSelected ? '#ffffff' : theme.brandBlue;

                  return (
                    <Pressable
                      key={menu.id}
                      onPress={() => {
                        onSelectScreen(menu.id);
                        setAllMenusModalVisible(false);
                      }}
                      style={[
                        styles.gridCard,
                        {
                          backgroundColor: isSelected ? theme.brandBlueLight : theme.surfaceMuted,
                          borderColor: isSelected ? theme.brandBlue : theme.border,
                        },
                      ]}
                    >
                      <View style={styles.gridCardTop}>
                        <View
                          style={[
                            styles.gridIconBox,
                            { backgroundColor: isSelected ? theme.brandBlue : theme.surface },
                          ]}
                        >
                          <PortalIcon name={menu.id} size={18} color={iconColor} />
                        </View>
                        {menu.badge ? (
                          <View
                            style={[
                              styles.gridBadge,
                              { backgroundColor: isSelected ? theme.brandBlue : theme.surface },
                            ]}
                          >
                            <Text
                              style={[
                                styles.gridBadgeText,
                                { color: isSelected ? '#ffffff' : theme.textSecondary },
                              ]}
                            >
                              {menu.badge}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <Text
                        style={[
                          styles.gridCardTitle,
                          { color: isSelected ? theme.brandBlue : theme.textPrimary },
                        ]}
                      >
                        {menu.title}
                      </Text>
                      <Text style={[styles.gridCardSub, { color: theme.textMuted }]}>
                        {menu.urduSubtitle}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 64,
  },
  tabButtonActive: {},
  iconContainer: {
    width: 32,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  allMenusButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: '100%',
    borderLeftWidth: 1,
    minWidth: 70,
  },
  allMenusIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allMenusIcon: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  allMenusText: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalSheetInner: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 11,
    marginTop: 1,
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
  gridContainer: {
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  gridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gridBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  gridCardTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridCardSub: {
    fontSize: 10,
    marginTop: 2,
  },
});
