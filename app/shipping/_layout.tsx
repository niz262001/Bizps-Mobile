import { Stack } from 'expo-router';

export default function ShippingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="generate" options={{ presentation: 'card' }} />
    </Stack>
  );
}
