import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useMockDatabase, addStock, reduceStock, getInventorySummary } from '../../services/mockDatabase';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';

export default function InventoryScreen() {
  const db = useMockDatabase();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [adjustment, setAdjustment] = useState<Record<string, string>>({});

  const inventorySummary = useMemo(() => getInventorySummary(db), [db]);
  const inventoryItems = useMemo(() => db.products.map((product) => ({
    product,
    variants: db.productVariants.filter((variant) => variant.productId === product.id),
  })), [db]);

  const toggleExpanded = (productId: string) => {
    setExpandedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          label="Total Products"
          value={inventorySummary.totalProducts.toString()}
          variant="primary"
        />
        <StatCard
          label="Low Stock"
          value={inventorySummary.lowStock.toString()}
          variant="warning"
        />
        <StatCard label="Out of Stock" value={inventorySummary.outOfStock.toString()} />
      </View>

      {/* Inventory Items */}
      <SectionHeader title="Inventory Status" />
      <View style={styles.itemsContainer}>
        {inventoryItems.map(({ product, variants }) => {
          const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);
          const status = totalStock === 0 ? 'out-of-stock' : totalStock <= 5 ? 'low-stock' : 'in-stock';

          return (
            <View key={product.id} style={styles.itemCard}>
              <TouchableOpacity
                style={styles.itemHeader}
                onPress={() => toggleExpanded(product.id)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{product.name}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemStock}>Total: {totalStock} units</Text>
                    <StatusBadge status={status as any} />
                  </View>
                </View>
                {expandedItems.includes(product.id) ? (
                  <ChevronUp {...({ size: 24, color: THEME.primary, strokeWidth: 2 } as any)} />
                ) : (
                  <ChevronDown {...({ size: 24, color: THEME.primary, strokeWidth: 2 } as any)} />
                )}
              </TouchableOpacity>

              {expandedItems.includes(product.id) && (
                <View style={styles.itemDetails}>
                  <View style={styles.sizeHeader}>
                    <Text style={styles.sizeLabel}>Size</Text>
                    <Text style={styles.sizeLabel}>Qty</Text>
                  </View>
                  {variants.map((variant) => (
                    <View key={variant.id} style={styles.sizeRow}>
                      <Text style={styles.sizeText}>{variant.size}</Text>
                      <View style={styles.stockActions}>
                        <Text style={styles.sizeText}>{variant.stock}</Text>
                        <TextInput
                          style={styles.qtyInput}
                          keyboardType="numeric"
                          value={adjustment[variant.id] ?? '1'}
                          onChangeText={(value) => setAdjustment((prev) => ({ ...prev, [variant.id]: value }))}
                          placeholderTextColor={THEME.text.light}
                        />
                        <TouchableOpacity
                          style={styles.smallButton}
                          onPress={() => {
                            const amount = Number(adjustment[variant.id] ?? '1');
                            addStock(variant.id, amount);
                          }}
                        >
                          <Text style={styles.smallButtonText}>+ </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.smallButton}
                          onPress={() => {
                            const amount = Number(adjustment[variant.id] ?? '1');
                            reduceStock(variant.id, amount);
                          }}
                        >
                          <Text style={styles.smallButtonText}>-</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
  itemsContainer: {
    marginBottom: SPACING.xl,
  },
  itemCard: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...THEME.shadow.medium,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    justifyContent: 'space-between',
  },
  itemStock: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
  },
  itemDetails: {
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  sizeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  sizeText: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.primary,
  },
  stockActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  qtyInput: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    minWidth: 48,
    marginHorizontal: SPACING.sm,
    color: THEME.text.primary,
  },
  smallButton: {
    backgroundColor: THEME.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
