import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  variant?: 'blue' | 'green' | 'red' | 'purple' | 'amber' | 'cyan';
  actionLabel?: string;
  onPressAction?: () => void;
  flex?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'blue',
  actionLabel,
  onPressAction,
  flex,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          barColor: '#10b981',
          bgIcon: theme.isDarkMode ? '#064e3b' : '#ecfdf5',
          iconBorder: theme.isDarkMode ? '#047857' : '#a7f3d0',
          textColor: theme.isDarkMode ? '#34d399' : '#059669',
        };
      case 'red':
        return {
          barColor: '#f43f5e',
          bgIcon: theme.isDarkMode ? '#4c0519' : '#fff1f2',
          iconBorder: theme.isDarkMode ? '#9f1239' : '#fecdd3',
          textColor: theme.isDarkMode ? '#fb7185' : '#e11d48',
        };
      case 'amber':
        return {
          barColor: '#f59e0b',
          bgIcon: theme.isDarkMode ? '#451a03' : '#fffbeb',
          iconBorder: theme.isDarkMode ? '#b45309' : '#fde68a',
          textColor: theme.isDarkMode ? '#fbbf24' : '#d97706',
        };
      case 'purple':
        return {
          barColor: '#8b5cf6',
          bgIcon: theme.isDarkMode ? '#3b0764' : '#f5f3ff',
          iconBorder: theme.isDarkMode ? '#6d28d9' : '#ddd6fe',
          textColor: theme.isDarkMode ? '#c084fc' : '#7c3aed',
        };
      case 'cyan':
        return {
          barColor: '#06b6d4',
          bgIcon: theme.isDarkMode ? '#083344' : '#ecfeff',
          iconBorder: theme.isDarkMode ? '#0e7490' : '#a5f3fc',
          textColor: theme.isDarkMode ? '#22d3ee' : '#0891b2',
        };
      case 'blue':
      default:
        return {
          barColor: '#0284c7',
          bgIcon: theme.isDarkMode ? '#082f49' : '#f0f9ff',
          iconBorder: theme.isDarkMode ? '#0369a1' : '#bae6fd',
          textColor: theme.isDarkMode ? '#38bdf8' : '#0284c7',
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        flex !== undefined && { flex },
      ]}
    >
      <View style={[styles.accentStrip, { backgroundColor: vStyles.barColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: theme.textMuted }]} numberOfLines={1}>
            {title}
          </Text>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: vStyles.bgIcon,
                borderColor: vStyles.iconBorder,
              },
            ]}
          >
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        </View>

        <Text
          style={[styles.value, { color: vStyles.textColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {value}
        </Text>

        <View style={styles.bottomRow}>
          {subtitle ? (
            <Text
              style={[styles.subtitle, { color: theme.textMuted }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : <View />}

          {actionLabel && onPressAction ? (
            <Pressable
              onPress={onPressAction}
              hitSlop={6}
              style={({ pressed }) => [
                styles.actionPill,
                {
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.border,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.actionText, { color: vStyles.textColor }]}>
                {actionLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    flexDirection: 'row',
  },
  accentStrip: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginRight: 6,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  value: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
    gap: 8,
  },
  subtitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
  },
  actionPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
