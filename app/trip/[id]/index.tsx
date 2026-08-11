import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Edit3, Package } from 'lucide-react-native';
import { MOCK_TRIPS } from '../../mockData';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatusBadge } from '../../components/StatusBadge';

type TabType = 'products' | 'orders' | 'buylist';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const trip = MOCK_TRIPS.find((t) => t.id === id);

  if (!trip) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{trip.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['products', 'orders', 'buylist'] as TabType[]).map((tab) => (
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
              {tab === 'buylist' ? 'Buy List' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Products Tab */}
        {activeTab === 'products' && (
          <View>
            {trip.products.length === 0 ? (
              <Text style={styles.emptyText}>No products added yet</Text>
            ) : (
              trip.products.map((product) => (
                <View key={product.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{product.name}</Text>
                      <StatusBadge status={product.status === 'ready' ? 'in-stock' : 'packing'} />
                    </View>
                    <TouchableOpacity>
                      <Edit3 size={20} color={THEME.primary} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardStats}>
                    <View>
                      <Text style={styles.statLabel}>Cost</Text>
                      <Text style={styles.statValue}>RM{product.costPrice}</Text>
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Selling</Text>
                      <Text style={styles.statValue}>RM{product.sellingPrice}</Text>
                    </View>
                    <View>
                      <Text style={styles.statLabel}>Total Qty</Text>
                      <Text style={styles.statValue}>{product.totalQuantity}</Text>
                    </View>
                  </View>

                  <View style={styles.sizeGrid}>
                    {product.sizes.map((size) => (
                      <View key={size.size} style={styles.sizeItem}>
                        <Text style={styles.sizeLabel}>{size.size}</Text>
                        <Text style={styles.sizeQty}>{size.quantity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <View>
            {trip.orders.length === 0 ? (
              <Text style={styles.emptyText}>No orders yet</Text>
            ) : (
              trip.orders.map((order) => (
                <View key={order.id} style={styles.card}>
                  <View style={styles.orderHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{order.orderId}</Text>
                      <Text style={styles.orderCustomer}>{order.customer}</Text>
                    </View>
                    <StatusBadge status={order.status} />
                  </View>

                  <View style={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.orderItem}>
                        <Text style={styles.itemName}>{item.productName}</Text>
                        <Text style={styles.itemDetail}>
                          {item.size} × {item.quantity} = RM
                          {(item.unitPrice * item.quantity).toLocaleString()}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>
                      Total: RM{order.total.toLocaleString()}
                    </Text>
                    {order.status === 'ready' && (
                      <TouchableOpacity
                        style={styles.shippingBtn}
                        onPress={() => router.push('/shipping/generate')}
                      >
                        <Package size={16} color="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.shippingBtnText}>Ship Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Buy List Tab */}
        {activeTab === 'buylist' && (
          <View>
            {trip.orders.length === 0 ? (
              <Text style={styles.emptyText}>No buy list (need orders first)</Text>
            ) : (
              <View>
                <Text style={styles.sectionLabel}>Auto-Generated Buy List</Text>
                {trip.products.map((product) => (
                  <View key={product.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{product.name}</Text>
                    {product.sizes.map((size) => (
                      <View
                        key={size.size}
                        style={styles.buyListRow}
                      >
                        <View>
                          <Text style={styles.buyListLabel}>Size {size.size}</Text>
                          <Text style={styles.buyListDetail}>
                            Current: {size.quantity}
                          </Text>
                        </View>
                        <View style={styles.buyListAction}>
                          {size.quantity < 10 && (
                            <>
                              <Text style={styles.buyNeeded}>
                                Need: {10 - size.quantity}
                              </Text>
                              <TouchableOpacity style={styles.markBoughtBtn}>
                                <CheckCircle2
                                  size={16}
                                  color={THEME.status.success}
                                  strokeWidth={2}
                                />
                                <Text style={styles.markBoughtText}>
                                  Mark Bought
                                </Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.primary,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: THEME.primary,
  },
  tabLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  activeTabLabel: {
    color: THEME.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.lg,
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...THEME.shadow.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.sm,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    marginBottom: SPACING.md,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.primary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  sizeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  sizeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  sizeQty: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.text.primary,
    marginTop: SPACING.xs,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderCustomer: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  orderItem: {
    marginBottom: SPACING.sm,
  },
  itemName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  itemDetail: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  orderFooter: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.primary,
    marginBottom: SPACING.md,
  },
  shippingBtn: {
    flexDirection: 'row',
    backgroundColor: THEME.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  shippingBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.xs,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.md,
  },
  buyListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  buyListLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  buyListDetail: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  buyListAction: {
    alignItems: 'flex-end',
  },
  buyNeeded: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: THEME.status.warning,
    marginBottom: SPACING.sm,
  },
  markBoughtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.md,
  },
  markBoughtText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: THEME.status.success,
    marginLeft: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: THEME.text.secondary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
  notFoundText: {
    fontSize: FONT_SIZES.lg,
    color: THEME.text.secondary,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.primary,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: THEME.primary,
  },
  tabLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  activeTabLabel: {
    color: THEME.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.lg,
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...THEME.shadow.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.sm,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    marginBottom: SPACING.md,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.primary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  sizeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  sizeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  sizeQty: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.text.primary,
    marginTop: SPACING.xs,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderCustomer: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  orderItems: {
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  orderItem: {
    marginBottom: SPACING.sm,
  },
  itemName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  itemDetail: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  orderFooter: {
    alignItems: 'flex-end',
  },
  orderTotal: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.primary,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.md,
  },
  buyListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  buyListLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  buyListDetail: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  buyListAction: {
    alignItems: 'flex-end',
  },
  buyNeeded: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: THEME.status.warning,
    marginBottom: SPACING.sm,
  },
  markBoughtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.md,
  },
  markBoughtText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: THEME.status.success,
    marginLeft: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: THEME.text.secondary,
    textAlign: 'center',
    paddingVertical: SPACING['2xl'],
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
  notFoundText: {
    fontSize: FONT_SIZES.lg,
    color: THEME.text.secondary,
  },
});
