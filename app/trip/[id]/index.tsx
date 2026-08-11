import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, CheckCircle2, Package, ShoppingBag } from 'lucide-react-native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerLabel}>Trip detail</Text>
          <Text style={styles.headerTitle}>{trip.name}</Text>
        </View>
        <StatusBadge status="ready" label="Active" />
      </View>

      <View style={styles.tabsContainer}>
        {(['products', 'orders', 'buylist'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
              {tab === 'buylist' ? 'Buy List' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
                      <View style={styles.cardTitleWrap}>
                        <Text style={styles.cardTitle}>{product.name}</Text>
                        <StatusBadge status={product.status === 'ready' ? 'in-stock' : 'low-stock'} />
                      </View>
                      <View style={styles.iconPill}>
                        <ShoppingBag size={16} color={THEME.primary} />
                      </View>
                    </View>

                    <View style={styles.cardStats}>
                      <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Cost</Text>
                        <Text style={styles.statValue}>RM{product.costPrice}</Text>
                      </View>
                      <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Selling</Text>
                        <Text style={styles.statValue}>RM{product.sellingPrice}</Text>
                      </View>
                      <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Qty</Text>
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

        {activeTab === 'orders' && (
          <View>
            {tripOrders.length === 0 ? (
              <Text style={styles.emptyText}>No orders yet</Text>
            ) : (
              tripOrders.map((order) => {
                const orderItems = db.orderItems.filter((item: { orderId: string }) => item.orderId === order.id);
                return (
                  <View key={order.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleWrap}>
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
                            <Text style={styles.itemDetail}>{variant?.size} × {item.quantity}</Text>
                          </View>
                        );
                      })}
                    </View>

                    <View style={styles.orderFooter}>
                      <Text style={styles.orderTotal}>Total RM{order.total.toLocaleString()}</Text>
                      {order.status === 'ready' && (
                        <TouchableOpacity style={styles.shippingBtn} onPress={() => router.push('/shipping/generate')}>
                          <Package size={16} color="#FFFFFF" strokeWidth={2} />
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

        {activeTab === 'buylist' && (
          <View>
            {buyListItems.length === 0 ? (
              <Text style={styles.emptyText}>Buy list is clear</Text>
            ) : (
              <View>
                <Text style={styles.sectionLabel}>Auto-generated buy list</Text>
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
                        <TouchableOpacity
                          style={styles.markBoughtBtn}
                          onPress={() => {
                            const success = markBuyListItemBought(item.id);
                            if (success) {
                              Alert.alert('Success', 'Buy list item marked as bought and inventory updated.');
                            }
                          }}
                        >
                          <CheckCircle2 size={16} color={THEME.status.success} strokeWidth={2} />
                          <Text style={styles.markBoughtText}>Mark Bought</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  headerTextWrap: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  headerLabel: {
    color: '#EDE9FE',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: SPACING.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  activeTab: {
    backgroundColor: '#F5F3FF',
  },
  tabLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  activeTabLabel: {
    color: THEME.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['3xl'],
  },
  card: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.xl,
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
  cardTitleWrap: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.sm,
  },
  iconPill: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#F5F3FF',
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    marginBottom: SPACING.md,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.primary,
  },
  sizeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#F8FAFC',
    marginHorizontal: SPACING.xs,
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
  orderCustomer: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.primary,
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
    paddingTop: SPACING.sm,
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


