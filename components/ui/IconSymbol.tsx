// Material Icons component with outline style and weight 100

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Material Icons mapping for the app tabs and components.
 * Using outline style icons with weight 100 for a clean, modern look.
 */
const MAPPING = {
  'house.fill': 'home', // Home tab
  'heart.fill': 'favorite', // Wellness tab
  'target': 'track-changes', // Goals tab
  'figure.run': 'directions-run', // Activities tab
  'building.2': 'business', // Facilities tab
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses Material Icons with outline style and weight 100.
 * This provides a consistent, modern look across all platforms.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <MaterialIcons 
      color={color} 
      size={size} 
      name={MAPPING[name]} 
      style={[
        {
          fontWeight: '100', // Weight 100 for thin outline style
        },
        style
      ]} 
    />
  );
}
