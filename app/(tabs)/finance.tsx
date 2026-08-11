import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MOCK_FINANCE } from '../../mockData';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatCard } from '../../components/StatCard';

type FinanceType = 'capital' | 'cash' | 'bank' | 'expense';

export default function FinanceScreen() {
  const [activeTab, setActiveTab] = useState<FinanceType>('cash');

  const financeTabs: FinanceType[] = ['capital', 'cash', 'bank', 'expense'];
  const tabLabels = {
    capital: 'Capital',
    cash: 'Cash',
    bank: 'Bank',
    expense: 'Expense',
  };

  const getFilteredRecords = () => {
    if (activeTab === 'capital') {
      return MOCK_FINANCE.filter((r) => r.type === 'capital');
    } else if (activeTab === 'expense') {
      return MOCK_FINANCE.filter((r) => r.type === 'expense');
    } else {
      return MOCK_FINANCE.filter((r) => r.type === activeTab);
    }
  };

  const calculateTotals = () => {
    const records = getFilteredRecords();
    const total = records.reduce((sum, r) => sum + r.amount, 0);
    return total;
  };

  const filteredRecords = getFilteredRecords();
  const total = calculateTotals();

  // Summary calculations
  const capitalTotal = MOCK_FINANCE.filter(
    (r) => r.type === 'capital'
  ).reduce((sum, r) => sum + r.amount, 0);
  const cashIncome = MOCK_FINANCE.filter(
    (r) => r.type === 'cash' && r.category === 'Sales'
  ).reduce((sum, r) => sum + r.amount, 0);
  const bankIncome = MOCK_FINANCE.filter(
    (r) => r.type === 'bank' && r.category === 'Sales'
  ).reduce((sum, r) => sum + r.amount, 0);
  const expenses = MOCK_FINANCE.filter(
    (r) => r.type === 'expense' || r.category === 'Expense'
  ).reduce((sum, r) => sum + r.amount, 0);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <StatCard
          label="Capital"
          value={`RM${capitalTotal.toLocaleString()}`}
          variant="primary"
        />
        <StatCard
          label="Cash Balance"
          value={`RM${cashIncome.toLocaleString()}`}
          variant="success"
        />
        <StatCard
          label="Bank Balance"
          value={`RM${bankIncome.toLocaleString()}`}
          variant="secondary"
        />
        <StatCard
          label="Total Expenses"
          value={`RM${expenses.toLocaleString()}`}
          variant="warning"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {financeTabs.map((tab) => (
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

      {/* Total for active tab */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total {tabLabels[activeTab]}</Text>
        <Text style={styles.totalValue}>RM{total.toLocaleString()}</Text>
      </View>

      {/* Records */}
      <View style={styles.recordsContainer}>
        {filteredRecords.length === 0 ? (
          <Text style={styles.emptyText}>No records for this category</Text>
        ) : (
          filteredRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordHeader}>
                <Text style={styles.recordCategory}>{record.category}</Text>
                <Text
                  style={[
                    styles.recordAmount,
                    record.amount > 0
                      ? { color: THEME.status.success }
                      : { color: THEME.status.error },
                  ]}
                >
                  {record.amount > 0 ? '+' : '-'}RM{Math.abs(record.amount)}
                </Text>
              </View>
              <Text style={styles.recordDescription}>
                {record.description}
              </Text>
              <View style={styles.recordFooter}>
                <Text style={styles.recordDate}>{record.date}</Text>
                {record.method && (
                  <Text style={styles.recordMethod}>{record.method}</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

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
  summaryContainer: {
    marginBottom: SPACING.lg,
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  activeTab: {
    backgroundColor: THEME.primary,
  },
  tabLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  totalCard: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...THEME.shadow.medium,
  },
  totalLabel: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
  },
  totalValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: THEME.primary,
    marginTop: SPACING.sm,
  },
  recordsContainer: {
    marginBottom: SPACING.xl,
  },
  recordItem: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...THEME.shadow.small,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  recordCategory: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  recordAmount: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
  },
  recordDescription: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
    marginBottom: SPACING.sm,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDate: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.light,
  },
  recordMethod: {
    fontSize: FONT_SIZES.xs,
    color: THEME.primary,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: THEME.text.secondary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },
});
