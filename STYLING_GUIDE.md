# Styling Guide - Tailwind CSS + Shadcn Components

This project has been migrated from StyleSheet-based styling to **Tailwind CSS** with **Shadcn-style components** for a modern, maintainable styling system.

## 🎨 Styling System Overview

### Tailwind CSS
- **NativeWind** for React Native compatibility
- **Custom color scheme** matching the original design
- **Dark mode support** built-in
- **Utility-first** approach for rapid development

### Shadcn-Style Components
- **Consistent design system** across the app
- **TypeScript support** with proper typing
- **Customizable variants** and sizes
- **Accessible by default**

## 🚀 Quick Start

### Using Tailwind Classes
```tsx
// Instead of StyleSheet
<View style={styles.container}>
  <Text style={styles.title}>Hello World</Text>
</View>

// Use Tailwind classes
<View className="flex-1 p-4 bg-background-light dark:bg-background-dark">
  <Text className="text-2xl font-bold text-text-light dark:text-text-dark">
    Hello World
  </Text>
</View>
```

### Using Shadcn Components
```tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default" size="sm">
      Click Me
    </Button>
  </CardContent>
</Card>
```

## 🎯 Available Components

### Core Components
- **`ThemedText`** - Text with variants (title, subtitle, bold, link)
- **`ThemedView`** - Container with theme-aware background

### UI Components
- **`Button`** - Multiple variants (default, outline, secondary, destructive, ghost, link)
- **`Card`** - Complete card system with header, content, footer
- **`Badge`** - Status indicators with variants
- **`Input`** - Form inputs with labels and error states

## 🎨 Color System

### Custom Colors (defined in `tailwind.config.js`)
```tsx
// Primary colors
text-primary-light    // #0a7ea4
text-primary-dark     // #fff

// Background colors
bg-background-light   // #fff
bg-background-dark    // #151718

// Text colors
text-text-light       // #11181C
text-text-dark        // #ECEDEE

// Icon colors
text-icon-light       // #687076
text-icon-dark        // #9BA1A6
```

### Usage Examples
```tsx
// Light/dark mode aware
<Text className="text-text-light dark:text-text-dark">
  Adaptive text color
</Text>

<View className="bg-background-light dark:bg-background-dark">
  Adaptive background
</View>
```

## 📱 Component Examples

### Button Variants
```tsx
<Button variant="default">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Card Layout
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>Content goes here</Text>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Form Input
```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  error="Invalid email format"
/>
```

## 🔧 Configuration Files

- **`tailwind.config.js`** - Tailwind configuration with custom colors
- **`global.css`** - Global Tailwind directives
- **`babel.config.js`** - NativeWind Babel plugin
- **`tsconfig.json`** - NativeWind TypeScript types

## 🎯 Migration Benefits

1. **Faster Development** - Utility classes for rapid prototyping
2. **Consistent Design** - Shadcn components ensure design consistency
3. **Better Maintainability** - No more StyleSheet objects scattered throughout
4. **Dark Mode Support** - Built-in dark mode with `dark:` prefix
5. **Type Safety** - Full TypeScript support for all components
6. **Responsive Design** - Easy responsive layouts with Tailwind utilities

## 🚀 Next Steps

1. **Add more Shadcn components** as needed (Modal, Select, etc.)
2. **Create component variants** for specific use cases
3. **Add animations** using Tailwind's animation utilities
4. **Implement theming** for different app sections

## 📚 Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/) 