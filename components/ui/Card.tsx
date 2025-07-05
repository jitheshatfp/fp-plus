import { Text, View, type ViewProps } from 'react-native';

export interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className = '', style, children, ...props }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardHeaderProps extends ViewProps {
  className?: string;
}

export function CardHeader({ className = '', style, children, ...props }: CardHeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          padding: 24,
          paddingBottom: 6,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <Text style={{
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: -0.025,
      color: '#11181C',
    }}>
      {children}
    </Text>
  );
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <Text style={{
      fontSize: 14,
      color: '#6b7280',
      marginTop: 6,
    }}>
      {children}
    </Text>
  );
}

export interface CardContentProps extends ViewProps {
  className?: string;
}

export function CardContent({ className = '', style, children, ...props }: CardContentProps) {
  return (
    <View
      style={[
        {
          padding: 24,
          paddingTop: 0,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export interface CardFooterProps extends ViewProps {
  className?: string;
}

export function CardFooter({ className = '', style, children, ...props }: CardFooterProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 24,
          paddingTop: 0,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
} 