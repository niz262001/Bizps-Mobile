import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Edit3, Package } from 'lucide-react-native';
import { useMockDatabase, markBuyListItemBought, getTripProducts, getTripOrders, getTripBuyListItems, getProductVariant, getProduct } from '../../../services/mockDatabase';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../../theme';
import { StatusBadge } from '../../../components/StatusBadge';

type TabType = 'products' | 'orders' | 'buylist';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const db = useMockDatabase();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const trip = db.trips.find((entry: { id: string }) => entry.id === id);
  const tripProducts = useMemo(() => getTripProducts(trip?.id ?? '', db), [trip, db]);
  const tripOrders = useMemo(() => getTripOrders(trip?.id ?? '', db), [trip, db]);
  const buyListItems = useMemo(() => getTripBuyListItems(trip?.id ?? '', db), [trip, db]);

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
          <ArrowLeft {...({ size: 24, color: '#FFFFFF', strokeWidth: 2.5 } as any)} />
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
            {tripProducts.length === 0 ? (
              <Text style={styles.emptyText}>No products added yet</Text>
            ) : (
              tripProducts.map((product: { id: string; name: string; status: string; costPrice: number; sellingPrice: number }) => {
                const variants = db.productVariants.filter((variant: { productId: string }) => variant.productId === product.id);
                const totalQuantity = variants.reduce((sum, variant) => sum + variant.stock, 0);
                return (
                  <View key={product.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{product.name}</Text>
                        <StatusBadge status={product.status === 'ready' ? 'in-stock' : 'packing'} />
                      </View>
                      <TouchableOpacity>
                        <Edit3 {...({ size: 20, color: THEME.primary, strokeWidth: 2 } as any)} />
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
                        <Text style={styles.statValue}>{totalQuantity}</Text>
                      </View>
                    </View>

                    <View style={styles.sizeGrid}>
                      {variants.map((variant: { id: string; size: string; stock: number }) => (
                        <View key={variant.id} style={styles.sizeItem}>
                          <Text style={styles.sizeLabel}>{variant.size}</Text>
                          <Text style={styles.sizeQty}>{variant.stock}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <View>
            {tripOrders.length === 0 ? (
              <Text style={styles.emptyText}>No orders yet</Text>
            ) : (
              tripOrders.map((order) => {
                const orderItems = db.orderItems.filter((item: { orderId: string }) => item.orderId === order.id);
                return (
                  <View key={order.id} style={styles.card}>
                    <View style={styles.orderHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{order.id}</Text>
                        <Text style={styles.orderCustomer}>{order.customerName}</Text>
                      </View>
                      <StatusBadge status={order.status} />
                    </View>

                    <View style={styles.orderItems}>
                      {orderItems.map((item: { productVariantId: string; quantity: number }, idx: number) => {
                        const variant = db.productVariants.find((candidate: { id: string }) => candidate.id === item.productVariantId);
                        const product = variant ? db.products.find((candidate: { id: string }) => candidate.id === variant.productId) : undefined;
                        return (
                          <View key={idx} style={styles.orderItem}>
                            <Text style={styles.itemName}>{product?.name ?? 'Product'}</Text>
                            <Text style={styles.itemDetail}>
                              {variant?.size} × {item.quantity} = RM
                              {((product?.sellingPrice ?? 0) * item.quantity).toLocaleString()}
                            </Text>
                          </View>
                        );
                      })}
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
                          <Package {...({ size: 16, color: '#FFFFFF', strokeWidth: 2 } as any)} />
                          <Text style={styles.shippingBtnText}>Ship Now</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Buy List Tab */}
        {activeTab === 'buylist' && (
          <View>
            {buyListItems.length === 0 ? (
              <Text style={styles.emptyText}>Buy list is clear</Text>
            ) : (
              <View>
                <Text style={styles.sectionLabel}>Auto-Generated Buy List</Text>
                {buyListItems.map((item: { id: string; productVariantId: string; quantity: number }) => {
                  const variant = getProductVariant(item.productVariantId, db);
                  const product = variant ? getProduct(variant.productId, db) : undefined;
                  return (
                    <View key={item.id} style={styles.card}>
                      <Text style={styles.cardTitle}>{product?.name ?? 'Product'}</Text>
                      <View style={styles.buyListRow}>
                        <View>
                          <Text style={styles.buyListLabel}>Size {variant?.size}</Text>
                          <Text style={styles.buyListDetail}>Needed: {item.quantity}</Text>
                        </View>
                        <View style={styles.buyListAction}>
                          <TouchableOpacity
                            style={styles.markBoughtBtn}
                            onPress={() => {
                              const success = markBuyListItemBought(item.id);
                              if (success) {
                                Alert.alert('Success', 'Buy list item marked as bought and inventory updated.');
                              }
                            }}
                          >
                            <CheckCircle2 {...({ size: 16, color: THEME.status.success, strokeWidth: 2 } as any)} />
                            <Text style={styles.markBoughtText}>Mark Bought</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
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


