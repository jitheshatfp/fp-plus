import { Text, View, type ViewProps } from 'react-native';

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ 
  variant = 'default', 
  className = '', 
  children, 
  style,
  ...props 
}: BadgeProps) {
  const getBadgeStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderRadius: 9999,
      paddingHorizontal: 10,
      paddingVertical: 2,
    };

    switch (variant) {
      case 'secondary':
        return { ...baseStyle, backgroundColor: '#f3f4f6' };
      case 'destructive':
        return { ...baseStyle, backgroundColor: '#ef4444' };
      case 'outline':
        return { ...baseStyle, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: 'transparent' };
      default:
        return { ...baseStyle, backgroundColor: '#0a7ea4' };
    }
  };

  const getTextStyle = () => {
    const baseStyle = { fontSize: 12, fontWeight: '500' as const };
    
    switch (variant) {
      case 'outline':
      case 'secondary':
        return { ...baseStyle, color: '#11181C' };
      case 'destructive':
        return { ...baseStyle, color: '#ffffff' };
      default:
        return { ...baseStyle, color: '#ffffff' };
    }
  };

  return (
    <View
      style={[getBadgeStyle(), style]}
      {...props}
    >
      <Text style={getTextStyle()}>
        {children}
      </Text>
    </View>
  );
} 