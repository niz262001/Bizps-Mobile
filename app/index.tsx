import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const features = [
  'AI Content Generator',
  'Push to Platform',
  'Inventory & Orders',
  'Buy List',
  'Finance',
  'Reports',
  'Trips',
  'Lain-lain',
];

function GradientCTA() {
  return (
    <Pressable style={styles.ctaButton}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#7C3AED" />
            <Stop offset="50%" stopColor="#EC4899" />
            <Stop offset="100%" stopColor="#F59E0B" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={16} fill="url(#ctaGradient)" />
      </Svg>
      <Text style={styles.ctaText}>Mula Percuma 7 Hari</Text>
    </Pressable>
  );
}

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>OpsPS</Text>
          </View>
          <Text style={styles.subtitle}>Personal Shopper Operating System</Text>
        </View>

        <Image source={require('../assets/hero.png')} style={styles.hero} resizeMode="cover" />

        <Text style={styles.title}>Urus Personal Shopper Dalam Satu Aplikasi</Text>
        <Text style={styles.description}>
          Automasi jualan, kandungan, inventori, pesanan dan kewangan anda dalam platform OpsPS Pro yang dibina untuk bisnes personal shopper moden.
        </Text>

        <GradientCTA />

        <View style={styles.pricingCard}>
          <Text style={styles.planName}>OpsPS Pro</Text>
          <Text style={styles.planPrice}>RM49/bulan</Text>
          <Text style={styles.offerText}>Founders Offer RM29/bulan</Text>
        </View>

        <View style={styles.featureGrid}>
          {features.map((feature) => (
            <View key={feature} style={styles.featureCard}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomPlaceholder}>
          <View style={styles.bottomPill} />
          <View style={styles.bottomPill} />
          <View style={styles.bottomPill} />
          <View style={styles.bottomPill} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F1FF',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 16,
  },
  header: {
    marginTop: 8,
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  subtitle: {
    color: '#6D28D9',
    fontSize: 13,
    fontWeight: '600',
  },
  hero: {
    width: '100%',
    height: 240,
    borderRadius: 20,
  },
  title: {
    color: '#22103A',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  description: {
    color: '#5B4B7A',
    fontSize: 15,
    lineHeight: 22,
  },
  ctaButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    gap: 6,
  },
  planName: {
    color: '#4C1D95',
    fontSize: 18,
    fontWeight: '700',
  },
  planPrice: {
    color: '#312E81',
    fontSize: 24,
    fontWeight: '800',
  },
  offerText: {
    color: '#DB2777',
    fontSize: 14,
    fontWeight: '700',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  featureCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  featureText: {
    color: '#43325E',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomPlaceholder: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomPill: {
    width: 58,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#E9D5FF',
  },
});
