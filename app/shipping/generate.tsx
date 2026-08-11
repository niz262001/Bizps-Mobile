import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../theme';
import { StatusBadge } from '../../components/StatusBadge';

export default function ShippingGenerateScreen() {
  const [recipient, setRecipient] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [courier, setCourier] = useState<string>('');
  const [shippingLabel, setShippingLabel] = useState<{
    trackingNumber: string;
    awbNumber: string;
    status: string;
  } | null>(null);

  const couriers = ['J&T Express', 'Pos Laju', 'Skynet', 'Lazada Logistics', 'GD Express'];

  const handleGenerateLabel = () => {
    if (!recipient || !weight || !courier) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate label generation
    const trackingNum = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const awbNum = `AWB${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    setShippingLabel({
      trackingNumber: trackingNum,
      awbNumber: awbNum,
      status: 'Generated',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Shipping</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Section */}
        {!shippingLabel && (
          <View>
            <Text style={styles.sectionTitle}>Recipient Information</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Recipient Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipient name"
                value={recipient}
                onChangeText={setRecipient}
                placeholderTextColor={THEME.text.light}
              />
            </View>

            <Text style={styles.sectionTitle}>Parcel Details</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight (kg) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter weight"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholderTextColor={THEME.text.light}
              />
            </View>

            <Text style={styles.subLabel}>Dimensions (Optional)</Text>
            <View style={styles.dimensionsRow}>
              <TextInput
                style={[styles.input, styles.dimensionInput]}
                placeholder="Length"
                value={length}
                onChangeText={setLength}
                keyboardType="decimal-pad"
                placeholderTextColor={THEME.text.light}
              />
              <TextInput
                style={[styles.input, styles.dimensionInput]}
                placeholder="Width"
                value={width}
                onChangeText={setWidth}
                keyboardType="decimal-pad"
                placeholderTextColor={THEME.text.light}
              />
              <TextInput
                style={[styles.input, styles.dimensionInput]}
                placeholder="Height"
                value={height}
                onChangeText={setHeight}
                keyboardType="decimal-pad"
                placeholderTextColor={THEME.text.light}
              />
            </View>

            <Text style={styles.sectionTitle}>Courier Selection</Text>

            <View style={styles.courierGrid}>
              {couriers.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.courierOption,
                    courier === c && styles.courierOptionActive,
                  ]}
                  onPress={() => setCourier(c)}
                >
                  <Text
                    style={[
                      styles.courierText,
                      courier === c && styles.courierTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateLabel}
            >
              <Send size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.generateButtonText}>Generate Label</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Label Result Section */}
        {shippingLabel && (
          <View>
            <View style={styles.successCard}>
              <StatusBadge status="shipped" label="Label Generated" />
              <Text style={styles.successText}>Shipping label successfully generated!</Text>
            </View>

            <View style={styles.labelDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Recipient</Text>
                <Text style={styles.detailValue}>{recipient}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Courier</Text>
                <Text style={styles.detailValue}>{courier}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Weight</Text>
                <Text style={styles.detailValue}>{weight} kg</Text>
              </View>

              {(length || width || height) && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dimensions</Text>
                  <Text style={styles.detailValue}>
                    {length}×{width}×{height} cm
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.labelBox}>
              <Text style={styles.labelBoxTitle}>Tracking Number</Text>
              <Text style={styles.trackingNumber}>
                {shippingLabel.trackingNumber}
              </Text>

              <Text style={styles.labelBoxTitle}>AWB Number</Text>
              <Text style={styles.awbNumber}>{shippingLabel.awbNumber}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copy Tracking</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.newLabelButton}
                onPress={() => {
                  setShippingLabel(null);
                  setRecipient('');
                  setWeight('');
                  setCourier('');
                }}
              >
                <Text style={styles.newLabelButtonText}>Generate Another</Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
    marginBottom: SPACING.sm,
  },
  subLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.base,
    borderWidth: 1,
    borderColor: THEME.border,
    color: THEME.text.primary,
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  dimensionInput: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  courierGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  courierOption: {
    width: '48%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: THEME.border,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  courierOptionActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  courierText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  courierTextActive: {
    color: '#FFFFFF',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: THEME.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZES.base,
    marginLeft: SPACING.sm,
  },
  successCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: THEME.status.success,
  },
  successText: {
    fontSize: FONT_SIZES.base,
    color: THEME.status.success,
    marginTop: SPACING.md,
    fontWeight: '600',
  },
  labelDetails: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...THEME.shadow.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  labelBox: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: THEME.primary,
    ...THEME.shadow.small,
  },
  labelBoxTitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: THEME.text.secondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  trackingNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.primary,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  awbNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: THEME.primary,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  copyButton: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  copyButtonText: {
    color: THEME.primary,
    fontWeight: '700',
    fontSize: FONT_SIZES.base,
  },
  newLabelButton: {
    flex: 1,
    backgroundColor: THEME.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  newLabelButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZES.base,
  },
});
