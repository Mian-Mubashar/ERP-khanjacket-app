import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';

const tabs = ['Home', 'Stock', 'Orders'] as const;
type Tab = (typeof tabs)[number];

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<Tab>('Home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#17324d" />
      <View style={styles.navbar}>
        <Text style={styles.brand}>Warehouse</Text>
        <View style={styles.tabs}>
          {tabs.map(tab => (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{selected: activeTab === tab}}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.heading}>{activeTab}</Text>
        <Text style={styles.description}>
          Welcome to your warehouse.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  navbar: {
    minHeight: 64,
    paddingHorizontal: 16,
    backgroundColor: '#17324d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 9,
    marginLeft: 4,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#d7e2ec',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#17324d',
  },
  content: {
    padding: 24,
  },
  heading: {
    color: '#17324d',
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    color: '#5d6b78',
    fontSize: 16,
  },
});

export default App;
