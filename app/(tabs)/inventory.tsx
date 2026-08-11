import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { MOCK_INVENTORY } from '../../mockData';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';

export default function InventoryScreen() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const totalProducts = MOCK_INVENTORY.length;
  const inStock = MOCK_INVENTORY.filter((i) => i.status === 'in-stock').length;
  const lowStock = MOCK_INVENTORY.filter((i) => i.status === 'low-stock').length;
  const outOfStock = MOCK_INVENTORY.filter((i) => i.status === 'out-of-stock')
    .length;

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
          value={totalProducts.toString()}
          variant="primary"
        />
        <StatCard
          label="In Stock"
          value={inStock.toString()}
          variant="success"
        />
        <StatCard
          label="Low Stock"
          value={lowStock.toString()}
          variant="warning"
        />
        <StatCard label="Out of Stock" value={outOfStock.toString()} />
      </View>

      {/* Inventory Items */}
      <SectionHeader title="Inventory Status" />
      <View style={styles.itemsContainer}>
        {MOCK_INVENTORY.map((item) => (
          <View key={item.productId} style={styles.itemCard}>
            <TouchableOpacity
              style={styles.itemHeader}
              onPress={() => toggleExpanded(item.productId)}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <View style={styles.itemMeta}>
                  <Text style={styles.itemStock}>
                    Total: {item.totalStock} units
                  </Text>
                  <StatusBadge status={item.status as any} />
                </View>
              </View>
              {expandedItems.includes(item.productId) ? (
                <ChevronUp size={24} color={THEME.primary} strokeWidth={2} />
              ) : (
                <ChevronDown size={24} color={THEME.primary} strokeWidth={2} />
              )}
            </TouchableOpacity>

            {expandedItems.includes(item.productId) && (
              <View style={styles.itemDetails}>
                <View style={styles.sizeHeader}>
                  <Text style={styles.sizeLabel}>Size</Text>
                  <Text style={styles.sizeLabel}>Qty</Text>
                </View>
                {item.sizes.map((size, idx) => (
                  <View key={idx} style={styles.sizeRow}>
                    <Text style={styles.sizeText}>{size.size}</Text>
                    <Text
                      style={[
                        styles.sizeText,
                        size.quantity === 0 && {
                          color: THEME.status.error,
                          fontWeight: '700',
                        },
                      ]}
                    >
                      {size.quantity}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
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
});
