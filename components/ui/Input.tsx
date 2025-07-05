import { Text, TextInput, View, type TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function Input({ 
  label, 
  error, 
  className = '', 
  labelClassName = '',
  errorClassName = '',
  style,
  ...props 
}: InputProps) {
  return (
    <View style={{ marginBottom: 8 }}>
      {label && (
        <Text style={{
          fontSize: 14,
          fontWeight: '500' as const,
          color: '#11181C',
          marginBottom: 4,
        }}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            height: 40,
            width: '100%',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#d1d5db',
            backgroundColor: '#ffffff',
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 14,
            color: '#11181C',
          },
          style
        ]}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {error && (
        <Text style={{
          fontSize: 14,
          color: '#ef4444',
          marginTop: 4,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
} 