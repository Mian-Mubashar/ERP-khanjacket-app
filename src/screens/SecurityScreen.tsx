import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export const SecurityScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.headerBox,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Device Security & Access Control</Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Authorized mobile phones, tablets, and manager login sessions.
        </Text>
      </View>

      <View
        style={[
          styles.deviceCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.deviceTop}>
          <Text style={[styles.deviceName, { color: theme.textPrimary }]}>📱 Mobile (This Device)</Text>
          <View
            style={[
              styles.activePill,
              {
                backgroundColor: theme.successLight,
                borderColor: theme.successBorder,
              },
            ]}
          >
            <Text style={[styles.activePillText, { color: theme.success }]}>Authorized</Text>
          </View>
        </View>
        <Text style={[styles.deviceDetails, { color: theme.textSecondary }]}>
          Platform: Android / iOS • Role: Super Admin • Status: Active
        </Text>
        <Text style={[styles.lastActive, { color: theme.textMuted }]}>Last active: Just now (Connected)</Text>
      </View>

      <View
        style={[
          styles.deviceCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.deviceTop}>
          <Text style={[styles.deviceName, { color: theme.textPrimary }]}>💻 Main Warehouse Office Desktop</Text>
          <View
            style={[
              styles.activePill,
              {
                backgroundColor: theme.successLight,
                borderColor: theme.successBorder,
              },
            ]}
          >
            <Text style={[styles.activePillText, { color: theme.success }]}>Authorized</Text>
          </View>
        </View>
        <Text style={[styles.deviceDetails, { color: theme.textSecondary }]}>
          IP: 127.0.0.1 (Localhost / LAN) • Role: Admin Portal
        </Text>
        <Text style={[styles.lastActive, { color: theme.textMuted }]}>Last active: Active session</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  headerBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
    marginTop: 4,
  },
  deviceCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  deviceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '700',
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  deviceDetails: {
    fontSize: 11,
    marginTop: 2,
  },
  lastActive: {
    fontSize: 10,
    marginTop: 4,
  },
});
