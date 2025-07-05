
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText, ThemedView } from '@/components/StyledComponents';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function FacilitiesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="building.2"
          style={{ bottom: -90, left: -35, position: 'absolute' }}
        />
      }>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ThemedText variant="title">Facilities</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText variant="subtitle">Manage Your Facilities</ThemedText>
        <ThemedText>
          Explore available facilities, book appointments, and manage your facility-related activities and services.
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText variant="subtitle">Features Coming Soon</ThemedText>
        <ThemedText>
          • Facility discovery and booking
        </ThemedText>
        <ThemedText>
          • Appointment scheduling
        </ThemedText>
        <ThemedText>
          • Facility reviews and ratings
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
} 