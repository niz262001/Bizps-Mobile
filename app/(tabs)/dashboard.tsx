import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { MOCK_ORDERS } from '../../mockData';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';

export default function DashboardScreen() {
  const totalOrders = MOCK_ORDERS.length;
  const totalSales = MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0);
  const totalCost = MOCK_ORDERS.reduce(
    (sum, order) =>
      sum +
      order.items.reduce((itemSum, item) => {
        const costPrice = item.unitPrice * 0.5; // Assume cost is ~50% of selling price
        return itemSum + costPrice * item.quantity;
      }, 0),
    0
  );
  const totalProfit = totalSales - totalCost;

  const statusCounts = {
    pending: MOCK_ORDERS.filter((o) => o.status === 'pending').length,
    packing: MOCK_ORDERS.filter((o) => o.status === 'packing').length,
    ready: MOCK_ORDERS.filter((o) => o.status === 'ready').length,
    shipped: MOCK_ORDERS.filter((o) => o.status === 'shipped').length,
    delivered: MOCK_ORDERS.filter((o) => o.status === 'delivered').length,
  };

  const dailyData = [
    {
      date: '2024-08-08',
      trips: 1,
      orders: 2,
      ship: 1,
      pending: 1,
    },
    {
      date: '2024-08-09',
      trips: 1,
      orders: 1,
      ship: 0,
      pending: 1,
    },
    {
      date: '2024-08-10',
      trips: 1,
      orders: 0,
      ship: 1,
      pending: 0,
    },
    {
      date: '2024-08-11',
      trips: 1,
      orders: 1,
      ship: 0,
      pending: 1,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          label="Order"
          value={totalOrders.toString()}
          variant="primary"
        />
        <StatCard
          label="Total Sales"
          value={`RM${totalSales.toLocaleString()}`}
          variant="secondary"
        />
        <StatCard
          label="Total Profit"
          value={`RM${totalProfit.toLocaleString()}`}
          variant="success"
        />
      </View>

      {/* Daily Summary Section */}
      <SectionHeader title="Daily Summary" />
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.headerText, { flex: 1.5 }]}>
            Date
          </Text>
          <Text style={[styles.tableCell, styles.headerText, { flex: 1 }]}>
            Trip
          </Text>
          <Text style={[styles.tableCell, styles.headerText, { flex: 1 }]}>
            Order
          </Text>
          <Text style={[styles.tableCell, styles.headerText, { flex: 1 }]}>
            Ship
          </Text>
          <Text style={[styles.tableCell, styles.headerText, { flex: 1 }]}>
            Pending
          </Text>
        </View>

        {dailyData.map((row, idx) => (
          <View
            key={idx}
            style={[
              styles.tableRow,
              idx % 2 === 0 && { backgroundColor: '#FAFAFA' },
            ]}
          >
            <Text style={[styles.tableCell, { flex: 1.5 }]}>
              {row.date}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{row.trips}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{row.orders}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{row.ship}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{row.pending}</Text>
          </View>
        ))}
      </View>

      {/* Status Section */}
      <SectionHeader title="Order Status" />
      <View style={styles.statusGrid}>
        <TouchableOpacity style={styles.statusCard}>
          <Text style={styles.statusValue}>{statusCounts.pending}</Text>
          <Text style={styles.statusLabel}>Pending Purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusCard}>
          <Text style={styles.statusValue}>{statusCounts.packing}</Text>
          <Text style={styles.statusLabel}>Packing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusCard}>
          <Text style={styles.statusValue}>{statusCounts.ready}</Text>
          <Text style={styles.statusLabel}>Ready to Ship</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusCard}>
          <Text style={styles.statusValue}>{statusCounts.shipped}</Text>
          <Text style={styles.statusLabel}>Shipped</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statusCard}>
          <Text style={styles.statusValue}>{statusCounts.delivered}</Text>
          <Text style={styles.statusLabel}>Delivered</Text>
        </TouchableOpacity>
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
  statsContainer: {
    marginBottom: SPACING.md,
  },
  tableContainer: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...THEME.shadow.medium,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: THEME.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  tableCell: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.primary,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statusCard: {
    width: '48%',
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...THEME.shadow.medium,
  },
  statusValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: THEME.primary,
    marginBottom: SPACING.sm,
  },
  statusLabel: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
});
