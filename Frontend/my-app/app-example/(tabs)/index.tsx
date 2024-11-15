import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Good Morning!🌞 ☕ </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Morning Schedule</ThemedText>
        
        <ThemedText>
          <ThemedText type="defaultSemiBold">Departure</ThemedText> | Departing at:
        </ThemedText>
        <ThemedText>
          Aldershot | 05:00
        </ThemedText>

        <ThemedText>
          <ThemedText type="defaultSemiBold">Destination</ThemedText> | Arrival
        </ThemedText>
        <ThemedText>
          Union | 08:30
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Evening Schedule</ThemedText>
        
        <ThemedText>
          <ThemedText type="defaultSemiBold">Departure</ThemedText> | Departing at:
        </ThemedText>
        <ThemedText>
          Union | 19:45
        </ThemedText>

        <ThemedText>
          <ThemedText type="defaultSemiBold">Destination</ThemedText> | Arrival
        </ThemedText>
        <ThemedText>
          Aldershot | 22:31
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Alarm Notifications</ThemedText>
        <ThemedText>
          Alarm: 18:20, 22:21 (10 minutes prior to arrival)
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
