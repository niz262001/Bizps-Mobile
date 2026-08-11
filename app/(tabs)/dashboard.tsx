import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import { useMockDatabase, getDashboardCounts } from '../../services/mockDatabase';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatCard } from '../../components/StatCard';

const dailyData = [
  { date: '2024-08-08', trips: 1, orders: 2, ship: 1, pending: 1 },
  { date: '2024-08-09', trips: 1, orders: 1, ship: 0, pending: 1 },
  { date: '2024-08-10', trips: 1, orders: 0, ship: 1, pending: 0 },
  { date: '2024-08-11', trips: 1, orders: 1, ship: 0, pending: 1 },
];

export default function DashboardScreen() {
  const db = useMockDatabase();
  const counts = getDashboardCounts(db);
  const totalSales = db.orders.reduce((sum, order) => sum + order.total, 0);
  const totalCost = db.orders.reduce((sum, order) => {
    const itemCost = db.orderItems
      .filter((item) => item.orderId === order.id)
      .reduce((itemSum, item) => {
        const variant = db.productVariants.find((candidate) => candidate.id === item.productVariantId);
        const product = variant ? db.products.find((entry) => entry.id === variant.productId) : undefined;
        return itemSum + (product?.costPrice ?? 0) * item.quantity;
      }, 0);
    return sum + itemCost;
  }, 0);
  const totalProfit = totalSales - totalCost;

  const statusCards = [
    { label: 'Pending', value: counts.pendingPurchase, tone: THEME.status.warning },
    { label: 'Packing', value: counts.packing, tone: THEME.status.info },
    { label: 'Ready', value: counts.readyToShip, tone: THEME.primary },
    { label: 'Shipped', value: counts.shipped, tone: THEME.status.success },
    { label: 'Delivered', value: counts.delivered, tone: THEME.status.success },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.eyebrow}>BizPS operations</Text>
            <Text style={styles.heroTitle}>Dashboard overview</Text>
            <Text style={styles.heroSubtitle}>Track bookings, inventory movement, and shipment readiness from one screen.</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Live</Text>
          </View>
        </View>

        <View style={styles.statsStack}>
          <StatCard label="Orders" value={counts.totalOrders.toString()} variant="primary" />
          <StatCard label="Sales" value={`RM${totalSales.toLocaleString()}`} variant="secondary" />
          <StatCard label="Profit" value={`RM${totalProfit.toLocaleString()}`} variant="success" />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily summary</Text>
            <Text style={styles.cardMeta}>Last 4 days</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerText, styles.dateCol]}>Date</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Trip</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Order</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Ship</Text>
            <Text style={[styles.tableCell, styles.headerText]}>Pending</Text>
          </View>

          {dailyData.map((row, idx) => (
            <View key={row.date} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.dateCol]}>{row.date}</Text>
              <Text style={styles.tableCell}>{row.trips}</Text>
              <Text style={styles.tableCell}>{row.orders}</Text>
              <Text style={styles.tableCell}>{row.ship}</Text>
              <Text style={styles.tableCell}>{row.pending}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order pipeline</Text>
            <Text style={styles.cardMeta}>By status</Text>
          </View>
          <View style={styles.statusGrid}>
            {statusCards.map((item) => (
              <View key={item.label} style={styles.statusCard}>
                <View style={[styles.statusDot, { backgroundColor: item.tone }]} />
                <Text style={styles.statusValue}>{item.value}</Text>
                <Text style={styles.statusLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['2xl'],
    paddingBottom: SPACING['3xl'],
  },
  heroCard: {
    backgroundColor: THEME.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING['2xl'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  heroTextWrap: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  eyebrow: {
    color: '#EDE9FE',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  heroSubtitle: {
    color: '#EDE9FE',
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  statsStack: {
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...THEME.shadow.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  cardMeta: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  tableRowAlt: {
    backgroundColor: '#FAFAFA',
    borderRadius: BORDER_RADIUS.md,
  },
  tableCell: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: THEME.text.primary,
  },
  headerText: {
    color: THEME.primary,
    fontWeight: '700',
  },
  dateCol: {
    flex: 1.4,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginBottom: SPACING.sm,
  },
  statusValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.xs,
  },
  statusLabel: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
  },
});
