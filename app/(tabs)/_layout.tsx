import React from 'react';
import { Tabs } from 'expo-router';
import {
  Home,
  Truck,
  Package,
  DollarSign,
  BarChart3,
  User,
} from 'lucide-react-native';

export default function TabsLayout() {
  const TAB_ICON_SIZE = 24;
  const THEME_PRIMARY = '#7C3AED';
  const THEME_INACTIVE = '#9CA3AF';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME_PRIMARY,
        tabBarInactiveTintColor: THEME_INACTIVE,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        headerStyle: {
          backgroundColor: THEME_PRIMARY,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerRight: () => (
          <User
            size={24}
            color="#FFFFFF"
            style={{ marginRight: 16 }}
            strokeWidth={2}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          headerTitle: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Home size={TAB_ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarLabel: 'Trips',
          headerTitle: 'Trips',
          tabBarIcon: ({ color }) => (
            <Truck size={TAB_ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarLabel: 'Inventory',
          headerTitle: 'Inventory',
          tabBarIcon: ({ color }) => (
            <Package size={TAB_ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="finance"
        options={{
          title: 'Finance',
          tabBarLabel: 'Finance',
          headerTitle: 'Finance',
          tabBarIcon: ({ color }) => (
            <DollarSign size={TAB_ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarLabel: 'Reports',
          headerTitle: 'Reports',
          tabBarIcon: ({ color }) => (
            <BarChart3 size={TAB_ICON_SIZE} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
