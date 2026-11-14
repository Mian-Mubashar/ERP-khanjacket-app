import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { HeaderNavbar } from './src/components/HeaderNavbar';
import { SidebarDrawer, ScreenName } from './src/components/SidebarDrawer';
import { BottomTabBar } from './src/components/BottomTabBar';
import { PushNotificationService } from './src/services/PushNotificationService';
import { LoginScreen } from './src/screens/LoginScreen';

// All 13 Portal Screens matching web sidebar
import { DashboardScreen } from './src/screens/DashboardScreen';
import { BranchesScreen } from './src/screens/BranchesScreen';
import { CustomersScreen } from './src/screens/CustomersScreen';
import { VendorsScreen } from './src/screens/VendorsScreen';
import { ArticlesScreen } from './src/screens/ArticlesScreen';
import { PurchasesScreen } from './src/screens/PurchasesScreen';
import { ClearanceScreen } from './src/screens/ClearanceScreen';
import { OutwardScreen } from './src/screens/OutwardScreen';
import { UgrahiScreen } from './src/screens/UgrahiScreen';
import { ReportsScreen } from './src/screens/ReportsScreen';
import { AnnouncementsScreen } from './src/screens/AnnouncementsScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

function MainApp(): React.JSX.Element {
  const { isDarkMode, theme, toggleDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshKey] = useState(0);

  // When logged out, reset active screen to Dashboard and close drawer
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentScreen('Dashboard');
      setIsDrawerOpen(false);
    }
  }, [isAuthenticated]);

  // Initialize push notification listener & sync token to backend on app launch
  useEffect(() => {
    PushNotificationService.initialize((data) => {
      if (data?.type) {
        switch (data.type) {
          case 'WASOOLI':
          case 'CUSTOMER_DUE':
            setCurrentScreen('Ugrahi');
            break;
          case 'STOCK_ALERT':
            setCurrentScreen('Articles');
            break;
          case 'OUTWARD':
          case 'BILL':
            setCurrentScreen('Outward');
            break;
          default:
            setCurrentScreen('Announcements');
        }
      }
    });
  }, []);

  const getScreenTitle = (screen: ScreenName): string => {
    switch (screen) {
      case 'Dashboard':
        return 'Overview & Analytics';
      case 'Branches':
        return 'Branches & Cities (Shehar)';
      case 'Customers':
        return 'Customers & Shopkeepers';
      case 'Vendors':
        return 'Vendors (China Factory)';
      case 'Articles':
        return 'Articles (Garments Stock)';
      case 'Purchases':
        return 'China Purchases (Shipments)';
      case 'Clearance':
        return 'Khan Traders Clearance';
      case 'Outward':
        return 'Outward (Maal Rawangi)';
      case 'Ugrahi':
        return 'Payment Collection (Route Sheets)';
      case 'Reports':
        return 'Reports (Hisaab Kitaab)';
      case 'Announcements':
        return 'Announcements & Alerts';
      case 'Security':
        return 'Security (Mobile Devices)';
      case 'Profile':
        return 'Admin Profile & Settings';
      default:
        return 'Khan Jacket House';
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen key={refreshKey} onNavigate={setCurrentScreen} />;
      case 'Branches':
        return <BranchesScreen key={refreshKey} />;
      case 'Customers':
        return <CustomersScreen key={refreshKey} />;
      case 'Vendors':
        return <VendorsScreen key={refreshKey} />;
      case 'Articles':
        return <ArticlesScreen key={refreshKey} />;
      case 'Purchases':
        return <PurchasesScreen key={refreshKey} />;
      case 'Clearance':
        return <ClearanceScreen key={refreshKey} />;
      case 'Outward':
        return <OutwardScreen key={refreshKey} />;
      case 'Ugrahi':
        return <UgrahiScreen key={refreshKey} />;
      case 'Reports':
        return <ReportsScreen key={refreshKey} />;
      case 'Announcements':
        return <AnnouncementsScreen key={refreshKey} onNavigate={setCurrentScreen} />;
      case 'Security':
        return <SecurityScreen key={refreshKey} />;
      case 'Profile':
        return <ProfileScreen key={refreshKey} onNavigate={setCurrentScreen} />;
      default:
        return <DashboardScreen key={refreshKey} onNavigate={setCurrentScreen} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDarkMode ? '#020617' : theme.brandDark}
      />

      {/* Top Header with Logo, Dark Mode, Notifications Bell & Global Search */}
      <HeaderNavbar
        title={getScreenTitle(currentScreen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Active Screen View */}
      <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
        {renderActiveScreen()}
      </View>

      {/* Docked Bottom Tab Navigation Bar with all 13 modules & All Menus Sheet */}
      <BottomTabBar
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Sliding Sidebar Drawer with all 13 Portal Modules */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        onClose={() => setIsDrawerOpen(false)}
      />
    </SafeAreaView>
  );
}

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
