
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText, ThemedView } from '@/components/StyledComponents';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function GoalsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="target"
          style={{ bottom: -90, left: -35, position: 'absolute' }}
        />
      }>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <ThemedText variant="title">Goals</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText variant="subtitle">Set & Track Your Goals</ThemedText>
        <ThemedText>
          Create personal goals, track your progress, and celebrate your achievements as you work towards your objectives.
        </ThemedText>
      </ThemedView>
      <ThemedView style={{ gap: 8, marginBottom: 8 }}>
        <ThemedText variant="subtitle">Features Coming Soon</ThemedText>
        <ThemedText>
          • Goal creation and management
        </ThemedText>
        <ThemedText>
          • Progress tracking and milestones
        </ThemedText>
        <ThemedText>
          • Achievement celebrations
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
} 