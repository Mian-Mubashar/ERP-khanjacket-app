import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '../theme/colors';
import { GlobalSearchBar } from './GlobalSearchBar';
import { ScreenName } from './SidebarDrawer';
import { NotificationsModal } from './NotificationsModal';

interface HeaderNavbarProps {
  title: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenDrawer: () => void;
  onNavigate: (screen: ScreenName) => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  title,
  isDarkMode,
  onToggleDarkMode,
  onOpenDrawer,
  onNavigate,
}) => {
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <>
      <View style={[styles.headerWrapper, isDarkMode && styles.headerDark]}>
        {/* Top Navbar Row */}
        <View style={styles.topRow}>
          {/* Left: 3-Lines Hamburger Menu + Official Logo */}
          <View style={styles.leftGroup}>
            <Pressable
              onPress={onOpenDrawer}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={({ pressed }) => [styles.menuButton, pressed && styles.menuButtonPressed]}
            >
              <View style={styles.hamburgerIcon}>
                <View style={styles.hamburgerLine} />
                <View style={[styles.hamburgerLine, styles.hamburgerLineMiddle]} />
                <View style={styles.hamburgerLine} />
              </View>
            </Pressable>

            {/* Official Khan Jacket House Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo-icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Center: Brand Name & Page Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.brandTitle} numberOfLines={1}>
              KHAN JACKET HOUSE
            </Text>
            <View style={styles.subtitleRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.pageSubtitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>

          {/* Right Actions: Dark Mode Toggle & Notification Bell */}
          <View style={styles.rightGroup}>
            {/* Dark / Light Mode Toggle Button */}
            <Pressable
              onPress={onToggleDarkMode}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
              accessibilityLabel="Toggle Dark Mode"
            >
              <Text style={styles.modeIconText}>{isDarkMode ? '☀️' : '🌙'}</Text>
            </Pressable>

            {/* Notifications Bell with Unread Badge */}
            <Pressable
              onPress={() => setNotifModalVisible(true)}
              style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
              accessibilityLabel="Notifications"
            >
              <Text style={styles.bellIconText}>🔔</Text>
              {unreadCount > 0 ? (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>
        </View>

        {/* Main Global Search Bar */}
        <GlobalSearchBar onNavigate={onNavigate} />
      </View>

      {/* Notifications Panel Modal */}
      <NotificationsModal
        visible={notifModalVisible}
        onClose={() => setNotifModalVisible(false)}
        onCountChange={(count) => setUnreadCount(count)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: colors.brandDark,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerDark: {
    backgroundColor: '#020617',
    borderBottomColor: '#0f172a',
  },
  topRow: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  hamburgerIcon: {
    width: 18,
    height: 13,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  hamburgerLineMiddle: {
    width: '80%',
  },
  logoContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 5,
  },
  pageSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconBtnPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modeIconText: {
    fontSize: 16,
  },
  bellIconText: {
    fontSize: 16,
  },
  bellBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.brandDark,
  },
  bellBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
});
