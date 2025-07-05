import { Image } from 'expo-image';
import { Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText, ThemedView } from '@/components/StyledComponents';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={{ height: 178, width: 290, bottom: 0, left: 0, position: 'absolute' }}
        />
      }>
      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <ThemedText variant="title">Welcome!</ThemedText>
        <HelloWave />
        <Badge variant="secondary">New</Badge>
      </ThemedView>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Edit <ThemedText variant="bold">app/(tabs)/index.tsx</ThemedText> to see changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemedText style={{ marginBottom: 16 }}>
            Press{' '}
            <ThemedText variant="bold">
              {Platform.select({
                ios: 'cmd + d',
                android: 'cmd + m',
                web: 'F12',
              })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
          <Button variant="default" size="sm">
            Learn More
          </Button>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Explore Features</CardTitle>
          <CardDescription>
            Discover what's included in this starter app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemedText style={{ marginBottom: 16 }}>
            {`Tap the Explore tab to learn more about what's included in this starter app.`}
          </ThemedText>
          <Button variant="outline" size="sm">
            Explore
          </Button>
        </CardContent>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHeader>
          <CardTitle>Fresh Start</CardTitle>
          <CardDescription>
            Reset the project when you're ready
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemedText style={{ marginBottom: 16 }}>
            {`When you're ready, run `}
            <ThemedText variant="bold">npm run reset-project</ThemedText> to get a fresh{' '}
            <ThemedText variant="bold">app</ThemedText> directory.
          </ThemedText>
          <Button variant="destructive" size="sm">
            Reset Project
          </Button>
        </CardContent>
      </Card>
    </ParallaxScrollView>
  );
}
