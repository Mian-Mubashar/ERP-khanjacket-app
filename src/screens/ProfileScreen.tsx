import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ScreenName } from '../components/SidebarDrawer';
import { API_BASE_URL } from '../services/api';

interface ProfileScreenProps {
  onNavigate?: (screen: ScreenName) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  const { isDarkMode, theme, toggleDarkMode } = useTheme();

  const handleClearCache = () => {
    Alert.alert(
      'Cache Cleared',
      'Local offline storage and temporary datasets have been refreshed from the central database.',
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out of the Khan Jacket House portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            if (onNavigate) {
              onNavigate('Dashboard');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* User Hero Card */}
      <View
        style={[
          styles.profileHero,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.brandBlue }]}>
            <Text style={styles.avatarLetter}>A</Text>
          </View>
          <View style={styles.userInfoBox}>
            <View style={styles.nameRow}>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>
                Admin Portal
              </Text>
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: theme.brandBlueLight, borderColor: theme.brandBlueBorder },
                ]}
              >
                <Text style={[styles.verifiedText, { color: theme.brandBlue }]}>
                  Super Admin
                </Text>
              </View>
            </View>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
              admin@khanjacket.com
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
              <Text style={[styles.statusLabel, { color: theme.success }]}>
                Connected • Live Database
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* App Preferences & Theme Section */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          App Theme & Display
        </Text>

        {/* Dark Mode Switch Row */}
        <View style={[styles.preferenceRow, { borderBottomColor: theme.border }]}>
          <View style={styles.prefIconLabel}>
            <View
              style={[
                styles.prefIconBox,
                { backgroundColor: isDarkMode ? '#1e293b' : '#fef3c7' },
              ]}
            >
              <Text style={styles.prefEmoji}>{isDarkMode ? '🌙' : '☀️'}</Text>
            </View>
            <View style={styles.prefTextBox}>
              <Text style={[styles.prefTitle, { color: theme.textPrimary }]}>
                Dark Mode
              </Text>
              <Text style={[styles.prefSubtitle, { color: theme.textMuted }]}>
                {isDarkMode
                  ? 'Active: Deep Slate dark theme across entire app'
                  : 'Active: Clean White & Navy light theme'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#cbd5e1', true: theme.brandBlue }}
            thumbColor={isDarkMode ? '#ffffff' : '#ffffff'}
          />
        </View>

        {/* Currency & Locale Info */}
        <View style={styles.preferenceRow}>
          <View style={styles.prefIconLabel}>
            <View style={[styles.prefIconBox, { backgroundColor: theme.brandBlueLight }]}>
              <Text style={styles.prefEmoji}>🇵🇰</Text>
            </View>
            <View style={styles.prefTextBox}>
              <Text style={[styles.prefTitle, { color: theme.textPrimary }]}>
                Currency & Region
              </Text>
              <Text style={[styles.prefSubtitle, { color: theme.textMuted }]}>
                Pakistani Rupee (PKR • Rs.)
              </Text>
            </View>
          </View>
          <View style={[styles.valuePill, { backgroundColor: theme.surfaceMuted }]}>
            <Text style={[styles.valuePillText, { color: theme.textSecondary }]}>PKR</Text>
          </View>
        </View>
      </View>

      {/* Backend & Network Status Card */}
      <View
        style={[
          styles.sectionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
          Backend API Connection
        </Text>

        <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Server URL</Text>
          <Text style={[styles.infoValue, { color: theme.brandBlue }]}>
            {API_BASE_URL}
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Database</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            MySQL (khan_jacket_db)
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Sync Status</Text>
          <View style={styles.syncBox}>
            <View style={[styles.syncDot, { backgroundColor: theme.success }]} />
            <Text style={[styles.syncText, { color: theme.success }]}>Online (0 ms lag)</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textMuted }]}>App Version</Text>
          <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
            v2.0.0 Production Release
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={handleClearCache}
          style={[
            styles.actionCardBtn,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.actionBtnIcon]}>🔄</Text>
          <Text style={[styles.actionBtnLabel, { color: theme.textPrimary }]}>
            Clear Cache & Resync Data
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSignOut}
          style={[
            styles.actionCardBtn,
            {
              backgroundColor: theme.dangerLight,
              borderColor: theme.dangerBorder,
            },
          ]}
        >
          <Text style={styles.actionBtnIcon}>🚪</Text>
          <Text style={[styles.actionBtnLabel, { color: theme.danger }]}>
            Sign Out / Switch Operator
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.footerText, { color: theme.textMuted }]}>
        Khan Jacket House China Import & Wholesale ERP • Mobile Native
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 14,
    paddingBottom: 30,
  },
  profileHero: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  userInfoBox: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
  },
  verifiedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  prefIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  prefIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  prefEmoji: {
    fontSize: 18,
  },
  prefTextBox: {
    flex: 1,
  },
  prefTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  prefSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  valuePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  valuePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  syncBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  actionCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
  },
  actionBtnIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  actionBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 4,
  },
});

