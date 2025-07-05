import { Text, View, type TextProps, type ViewProps } from 'react-native';

export type StyledTextProps = TextProps & {
  variant?: 'default' | 'title' | 'subtitle' | 'link' | 'bold';
  className?: string;
};

export function ThemedText({ 
  style, 
  variant = 'default', 
  className,
  ...rest 
}: StyledTextProps) {
  const getTextStyle = () => {
    const baseStyle = { fontSize: 16, lineHeight: 24 };
    switch (variant) {
      case 'title':
        return { fontSize: 32, fontWeight: 'bold' as const, lineHeight: 32 };
      case 'subtitle':
        return { fontSize: 20, fontWeight: 'bold' as const };
      case 'link':
        return { lineHeight: 30, fontSize: 16, color: '#0a7ea4' };
      case 'bold':
        return { fontSize: 16, lineHeight: 24, fontWeight: '600' as const };
      default:
        return baseStyle;
    }
  };

  return (
    <Text
      style={[getTextStyle(), style]}
      {...rest}
    />
  );
}

export type StyledViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({ 
  style, 
  className,
  ...otherProps 
}: StyledViewProps) {
  return (
    <View
      style={style}
      {...otherProps}
    />
  );
} 