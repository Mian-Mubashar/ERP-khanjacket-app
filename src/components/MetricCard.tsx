import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  variant?: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'blue',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          barColor: colors.success,
          bgIcon: theme.isDarkMode ? '#064e3b' : colors.successLight,
          textColor: theme.isDarkMode ? '#34d399' : colors.success,
        };
      case 'red':
        return {
          barColor: colors.danger,
          bgIcon: theme.isDarkMode ? '#4c0519' : colors.dangerLight,
          textColor: theme.isDarkMode ? '#fb7185' : colors.danger,
        };
      case 'amber':
        return {
          barColor: colors.warning,
          bgIcon: theme.isDarkMode ? '#451a03' : colors.warningLight,
          textColor: theme.isDarkMode ? '#fbbf24' : colors.warning,
        };
      case 'purple':
        return {
          barColor: colors.purple,
          bgIcon: theme.isDarkMode ? '#3b0764' : colors.purpleLight,
          textColor: theme.isDarkMode ? '#c084fc' : colors.purple,
        };
      case 'blue':
      default:
        return {
          barColor: theme.brandBlue,
          bgIcon: theme.brandBlueLight,
          textColor: theme.brandBlue,
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
      ]}
    >
      <View style={[styles.accentStrip, { backgroundColor: vStyles.barColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
          <View style={[styles.iconBox, { backgroundColor: vStyles.bgIcon }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        </View>

        <Text style={[styles.value, { color: vStyles.textColor }]} numberOfLines={1}>
          {value}
        </Text>

        <Text style={[styles.subtitle, { color: theme.textMuted }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
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
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
  },
});
