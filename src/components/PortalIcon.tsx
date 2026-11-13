import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { ScreenName } from './SidebarDrawer';

export const PORTAL_ICON_MAP: Record<ScreenName, ReturnType<typeof require>> = {
  Dashboard: require('../assets/icons/dashboard.png'),
  Branches: require('../assets/icons/branches.png'),
  Customers: require('../assets/icons/customers.png'),
  Vendors: require('../assets/icons/vendors.png'),
  Articles: require('../assets/icons/articles.png'),
  Purchases: require('../assets/icons/purchases.png'),
  Clearance: require('../assets/icons/clearance.png'),
  Outward: require('../assets/icons/outward.png'),
  Ugrahi: require('../assets/icons/ugrahi.png'),
  Reports: require('../assets/icons/reports.png'),
  Announcements: require('../assets/icons/announcements.png'),
  Security: require('../assets/icons/security.png'),
  Profile: require('../assets/icons/profile.png'),
};

interface PortalIconProps {
  name: ScreenName;
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export const PortalIcon: React.FC<PortalIconProps> = ({
  name,
  size = 20,
  color,
  style,
}) => {
  const iconSource = PORTAL_ICON_MAP[name] || PORTAL_ICON_MAP.Dashboard;
  return (
    <Image
      source={iconSource}
      style={[
        {
          width: size,
          height: size,
        },
        color ? { tintColor: color } : undefined,
        style,
      ]}
      resizeMode="contain"
    />
  );
};

