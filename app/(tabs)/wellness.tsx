
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText, ThemedView } from '@/components/StyledComponents';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function WellnessScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="heart.fill"
          style={{ bottom: -90, left: -35, position: 'absolute' }}
        />
      }>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ThemedText variant="title">Wellness</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText variant="subtitle">Your Wellness Journey</ThemedText>
        <ThemedText>
          Track your health and wellness goals, monitor your progress, and discover new ways to improve your well-being.
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText variant="subtitle">Features Coming Soon</ThemedText>
        <ThemedText>
          • Health tracking and monitoring
        </ThemedText>
        <ThemedText>
          • Wellness tips and recommendations
        </ThemedText>
        <ThemedText>
          • Progress visualization
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
} 