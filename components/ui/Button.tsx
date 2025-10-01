import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  className = '',
  children, 
  style,
  ...props 
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    const sizeStyle = (() => {
      switch (size) {
        case 'sm':
          return { height: 36, paddingHorizontal: 12, borderRadius: 6 };
        case 'lg':
          return { height: 44, paddingHorizontal: 32, borderRadius: 6 };
        case 'icon':
          return { height: 40, width: 40, borderRadius: 6 };
        default:
          return { height: 40, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 };
      }
    })();

    const variantStyle = (() => {
      switch (variant) {
        case 'destructive':
          return { backgroundColor: '#ef4444' };
        case 'outline':
          return { borderWidth: 1, borderColor: '#d1d5db', backgroundColor: 'transparent' };
        case 'secondary':
          return { backgroundColor: '#f3f4f6' };
        case 'ghost':
          return { backgroundColor: 'transparent' };
        case 'link':
          return { backgroundColor: 'transparent' };
        default:
          return { backgroundColor: '#3F5FFB' };
      }
    })();

    return { ...baseStyle, ...sizeStyle, ...variantStyle };
  };

  const getTextStyle = () => {
    const baseStyle = { fontWeight: '500' as const, textAlign: 'center' as const };
    
    switch (variant) {
      case 'outline':
      case 'secondary':
      case 'ghost':
        return { ...baseStyle, color: '#11181C' };
      case 'link':
        return { ...baseStyle, color: '#3F5FFB' };
      default:
        return { ...baseStyle, color: '#ffffff' };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={getTextStyle()}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
} 