import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MOCK_ORDERS, MOCK_FINANCE, MOCK_INVENTORY, MOCK_TRIPS } from '../../mockData';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatCard } from '../../components/StatCard';

type ReportType = 'pl' | 'sales' | 'expense' | 'trip' | 'inventory';

export default function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<ReportType>('pl');

  const reportTabs: ReportType[] = ['pl', 'sales', 'expense', 'trip', 'inventory'];
  const tabLabels = {
    pl: 'P&L',
    sales: 'Sales',
    expense: 'Expense',
    trip: 'Trip',
    inventory: 'Inventory',
  };

  // P&L Calculations
  const totalSales = MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0);
  const cogs = MOCK_ORDERS.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((itemSum, item) => {
        const costPrice = item.unitPrice * 0.5; // Assume cost is ~50% of selling price
        return itemSum + costPrice * item.quantity;
      }, 0),
    0
  );
  const expenses = MOCK_FINANCE.filter(
    (r) => r.type === 'expense' || r.category === 'Expense'
  ).reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalSales - cogs - expenses;

  // Sales Report
  const salesByTrip = MOCK_TRIPS.map((trip) => ({
    name: trip.name,
    orders: trip.orders.length,
    total: trip.orders.reduce((sum, order) => sum + order.total, 0),
  }));

  // Expense Report
  const expensesByCategory = MOCK_FINANCE.filter(
    (r) => r.type === 'expense' || r.category === 'Expense'
  ).reduce(
    (acc, record) => {
      const existing = acc.find((item) => item.category === record.category);
      if (existing) {
        existing.amount += record.amount;
      } else {
        acc.push({ category: record.category, amount: record.amount });
      }
      return acc;
    },
    [] as { category: string; amount: number }[]
  );

  // Trip Report
  const tripStats = MOCK_TRIPS.map((trip) => ({
    name: trip.name,
    products: trip.products.length,
    orders: trip.orders.length,
    sales: trip.orders.reduce((sum, order) => sum + order.total, 0),
  }));

  // Inventory Report
  const lowStockItems = MOCK_INVENTORY.filter(
    (i) => i.status === 'low-stock' || i.status === 'out-of-stock'
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {reportTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab && styles.activeTabLabel,
              ]}
            >
              {tabLabels[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* P&L Report */}
      {activeTab === 'pl' && (
        <View>
          <View style={styles.reportCard}>
            <Text style={styles.reportLabel}>Total Sales</Text>
            <Text style={[styles.reportValue, { color: THEME.status.success }]}>
              RM{totalSales.toLocaleString()}
            </Text>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.reportLabel}>COGS (Cost of Goods Sold)</Text>
            <Text style={[styles.reportValue, { color: THEME.status.warning }]}>
              -RM{cogs.toLocaleString()}
            </Text>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.reportLabel}>Gross Profit</Text>
            <Text style={[styles.reportValue, { color: THEME.primary }]}>
              RM{(totalSales - cogs).toLocaleString()}
            </Text>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.reportLabel}>Expenses</Text>
            <Text style={[styles.reportValue, { color: THEME.status.error }]}>
              -RM{expenses.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.reportCard, styles.netProfitCard]}>
            <Text style={styles.reportLabel}>Net Profit</Text>
            <Text
              style={[
                styles.reportValue,
                { color: netProfit > 0 ? THEME.status.success : THEME.status.error },
                { fontSize: FONT_SIZES['2xl'] },
              ]}
            >
              RM{netProfit.toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <View>
          {salesByTrip.map((trip, idx) => (
            <View key={idx} style={styles.reportCard}>
              <Text style={styles.reportLabel}>{trip.name}</Text>
              <View style={styles.reportStats}>
                <View>
                  <Text style={styles.statSmallLabel}>Orders</Text>
                  <Text style={styles.statSmallValue}>{trip.orders}</Text>
                </View>
                <View>
                  <Text style={styles.statSmallLabel}>Total Sales</Text>
                  <Text style={styles.statSmallValue}>RM{trip.total}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Expense Report */}
      {activeTab === 'expense' && (
        <View>
          {expensesByCategory.length === 0 ? (
            <Text style={styles.emptyText}>No expenses recorded</Text>
          ) : (
            expensesByCategory.map((category, idx) => (
              <View key={idx} style={styles.reportCard}>
                <Text style={styles.reportLabel}>{category.category}</Text>
                <Text style={[styles.reportValue, { color: THEME.status.error }]}>
                  -RM{category.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      )}

      {/* Trip Report */}
      {activeTab === 'trip' && (
        <View>
          {tripStats.map((trip, idx) => (
            <View key={idx} style={styles.reportCard}>
              <Text style={styles.reportLabel}>{trip.name}</Text>
              <View style={styles.reportGrid}>
                <View style={styles.reportGridItem}>
                  <Text style={styles.statSmallLabel}>Products</Text>
                  <Text style={styles.statSmallValue}>{trip.products}</Text>
                </View>
                <View style={styles.reportGridItem}>
                  <Text style={styles.statSmallLabel}>Orders</Text>
                  <Text style={styles.statSmallValue}>{trip.orders}</Text>
                </View>
                <View style={styles.reportGridItem}>
                  <Text style={styles.statSmallLabel}>Sales</Text>
                  <Text style={styles.statSmallValue}>RM{trip.sales}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Inventory Report */}
      {activeTab === 'inventory' && (
        <View>
          <View style={styles.reportCard}>
            <Text style={styles.reportLabel}>Total Products</Text>
            <Text style={styles.reportValue}>{MOCK_INVENTORY.length}</Text>
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.reportLabel}>Low Stock Items</Text>
            <Text style={[styles.reportValue, { color: THEME.status.warning }]}>
              {lowStockItems.length}
            </Text>
          </View>

          {lowStockItems.length > 0 && (
            <View style={[styles.reportCard, styles.warningCard]}>
              <Text style={styles.warningTitle}>Items Needing Attention:</Text>
              {lowStockItems.map((item, idx) => (
                <View key={idx} style={styles.warningItem}>
                  <Text style={styles.warningLabel}>{item.productName}</Text>
                  <Text style={styles.warningValue}>
                    {item.totalStock} units left
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['2xl'],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.lg,
    ...THEME.shadow.small,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  activeTab: {
    backgroundColor: THEME.primary,
  },
  tabLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  reportCard: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...THEME.shadow.small,
  },
  netProfitCard: {
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  reportLabel: {
    fontSize: FONT_SIZES.base,
    color: THEME.text.secondary,
    marginBottom: SPACING.sm,
  },
  reportValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  reportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  reportGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  statSmallLabel: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    marginBottom: SPACING.xs,
  },
  statSmallValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.primary,
  },
  warningCard: {
    backgroundColor: '#FFFAEB',
    borderLeftWidth: 4,
    borderLeftColor: THEME.status.warning,
  },
  warningTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.md,
  },
  warningItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.2)',
  },
  warningLabel: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.primary,
  },
  warningValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.status.warning,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: THEME.text.secondary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },
});
