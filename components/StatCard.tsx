import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME, SPACING, FONT_SIZES, BORDER_RADIUS } from '../theme';

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function StatCard({
  label,
  value,
  subtitle,
  variant = 'primary',
}: StatCardProps) {
  const variantColors = {
    primary: THEME.primary,
    secondary: THEME.status.info,
    success: THEME.status.success,
    warning: THEME.status.warning,
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: variantColors[variant],
          borderLeftWidth: 4,
        },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...THEME.shadow.medium,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: THEME.text.secondary,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    color: THEME.text.light,
    marginTop: SPACING.xs,
  },
});
