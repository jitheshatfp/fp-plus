
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText, ThemedView } from '@/components/StyledComponents';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ActivitiesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="figure.run"
          style={{ bottom: -90, left: -35, position: 'absolute' }}
        />
      }>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <ThemedText variant="title">Activities</ThemedText>
        <HelloWave />
        <Badge variant="default">Active</Badge>
      </ThemedView>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Track Your Activities</CardTitle>
          <CardDescription>
            Log your daily activities, workouts, and exercises
          </CardDescription>
        </CardHeader>
        <CardContent style={{ gap: 16 }}>
          <Input
            label="Activity Name"
            placeholder="Enter activity name"
          />
          <Input
            label="Duration (minutes)"
            placeholder="30"
            keyboardType="numeric"
          />
          <Input
            label="Notes"
            placeholder="How was your workout?"
            multiline
            numberOfLines={3}
          />
          <Button variant="default" size="sm">
            Log Activity
          </Button>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Features Coming Soon</CardTitle>
          <CardDescription>
            Exciting features on the horizon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemedView style={{ gap: 8 }}>
            <ThemedText>• Activity logging and tracking</ThemedText>
            <ThemedText>• Workout planning and scheduling</ThemedText>
            <ThemedText>• Performance analytics</ThemedText>
          </ThemedView>
        </CardContent>
      </Card>
    </ParallaxScrollView>
  );
} 