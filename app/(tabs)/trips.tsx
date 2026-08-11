import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Package, Truck as TruckIcon } from 'lucide-react-native';

const iconProps = {
  size: 20,
  strokeWidth: 2,
};
import { MOCK_TRIPS } from '../../mockData';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';

export default function TripsScreen() {
  const [activeTrips] = useState(MOCK_TRIPS.filter(t => t.status === 'active'));

  const handleTripPress = (tripId: string) => {
    router.push({
      pathname: '/trip/[id]',
      params: { id: tripId },
    });
  };

  const TripCard = ({ trip }: { trip: typeof MOCK_TRIPS[0] }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => handleTripPress(trip.id)}
    >
      <View style={styles.tripHeader}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <Text style={styles.tripDate}>
          {new Date(trip.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.tripStats}>
        <View style={styles.statItem}>
          <Package {...({ ...iconProps, color: THEME.primary } as any)} />
          <View style={{ marginLeft: SPACING.md }}>
            <Text style={styles.statLabel}>Products</Text>
            <Text style={styles.statValue}>{trip.totalProducts}</Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <TruckIcon {...({ ...iconProps, color: THEME.status.info } as any)} />
          <View style={{ marginLeft: SPACING.md }}>
            <Text style={styles.statLabel}>Orders</Text>
            <Text style={styles.statValue}>{trip.totalOrders}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.tripFooter}>Tap to view details →</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton}>
          <Plus {...({ ...iconProps, size: 20, color: '#FFFFFF', strokeWidth: 2.5 } as any)} />
          <Text style={styles.addButtonText}>Add Trip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TripCard trip={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <TruckIcon {...({ size: 48, color: THEME.text.light, strokeWidth: 1.5 } as any)} />
            <Text style={styles.emptyText}>No active trips</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: THEME.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.base,
  },
  listContent: {
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
  },
  tripCard: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...THEME.shadow.medium,
  },
  tripHeader: {
    marginBottom: SPACING.md,
  },
  tripName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  tripDate: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
    marginTop: SPACING.xs,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.secondary,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.text.primary,
    marginTop: SPACING.xs,
  },
  tripFooter: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.light,
    marginTop: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['3xl'],
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: THEME.text.secondary,
    marginTop: SPACING.md,
  },
});
