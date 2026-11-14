import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  type PressableProps,
  type TextProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
  View,
} from 'react-native';

const palette = {
  light: {
    page: '#eef4f1',
    surface: '#ffffff',
    surfaceAlt: '#f8fbf9',
    border: '#d7e1dc',
    text: '#0f1720',
    muted: '#5f6f68',
    accent: '#225e4d',
    accentSoft: '#d8efe5',
    danger: '#b42318',
    dangerSoft: '#fde9e7',
  },
  dark: {
    page: '#071015',
    surface: '#0d181d',
    surfaceAlt: '#111f25',
    border: '#20343d',
    text: '#f0f7f4',
    muted: '#9fb4ad',
    accent: '#7ad8bc',
    accentSoft: '#123028',
    danger: '#ff8a80',
    dangerSoft: '#351614',
  },
} as const;

type ThemeName = keyof typeof palette;

function usePalette() {
  const scheme = (useColorScheme() ?? 'light') as ThemeName;

  return palette[scheme];
}

type PageProps = {
  children: ReactNode;
  centered?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Page({ children, centered = false, contentStyle }: PageProps) {
  const colors = usePalette();
  const { width } = useWindowDimensions();
  const maxWidth = centered ? 560 : width >= 1200 ? 1120 : width >= 900 ? 960 : undefined;

  return (
    <View style={[styles.root, { backgroundColor: colors.page }]}> 
      <View style={[styles.decoration, { backgroundColor: colors.accentSoft, top: -120, left: -80 }]} />
      <View style={[styles.decoration, { backgroundColor: colors.accentSoft, bottom: -100, right: -70 }]} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View
          style={[
            styles.inner,
            centered ? styles.centeredInner : styles.leftInner,
            { maxWidth },
            contentStyle,
          ]}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

type PanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Panel({ children, style }: PanelProps) {
  const colors = usePalette();

  return <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

type TextBlockProps = TextProps & {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
};

export function Heading({ children, style, ...props }: TextBlockProps) {
  const colors = usePalette();

  return (
    <Text style={[styles.heading, { color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
}

export function Subheading({ children, style, ...props }: TextBlockProps) {
  const colors = usePalette();

  return (
    <Text style={[styles.subheading, { color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
}

export function BodyText({ children, style, ...props }: TextBlockProps) {
  const colors = usePalette();

  return (
    <Text style={[styles.body, { color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
}

export function MutedText({ children, style, ...props }: TextBlockProps) {
  const colors = usePalette();

  return (
    <Text style={[styles.muted, { color: colors.muted }, style]} {...props}>
      {children}
    </Text>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  busy?: boolean;
};

export function Button({ title, variant = 'primary', busy = false, disabled, style, ...props }: ButtonProps) {
  const colors = usePalette();
  const appearance = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: appearance.backgroundColor(colors),
          borderColor: appearance.borderColor(colors),
          opacity: disabled || busy ? 0.65 : pressed ? 0.86 : 1,
        },
        style,
      ]}
      {...props}>
      {busy ? (
        <ActivityIndicator color={appearance.foregroundColor(colors)} />
      ) : (
        <Text style={[styles.buttonLabel, { color: appearance.foregroundColor(colors) }]}>{title}</Text>
      )}
    </Pressable>
  );
}

type TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
  errorText?: string;
};

export function TextField({ label, helperText, errorText, style, ...props }: TextFieldProps) {
  const colors = usePalette();

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: errorText ? colors.danger : colors.border,
            color: colors.text,
          },
          style,
        ]}
        {...props}
      />
      {errorText ? <Text style={[styles.error, { color: colors.danger }]}>{errorText}</Text> : null}
      {!errorText && helperText ? <Text style={[styles.helper, { color: colors.muted }]}>{helperText}</Text> : null}
    </View>
  );
}

const variantStyles: Record<
  ButtonVariant,
  {
    backgroundColor: (colors: (typeof palette)[ThemeName]) => string;
    borderColor: (colors: (typeof palette)[ThemeName]) => string;
    foregroundColor: (colors: (typeof palette)[ThemeName]) => string;
  }
> = {
  primary: {
    backgroundColor: (colors) => colors.accent,
    borderColor: (colors) => colors.accent,
    foregroundColor: (colors) => colors.page,
  },
  secondary: {
    backgroundColor: (colors) => colors.surfaceAlt,
    borderColor: (colors) => colors.border,
    foregroundColor: (colors) => colors.text,
  },
  danger: {
    backgroundColor: (colors) => colors.danger,
    borderColor: (colors) => colors.danger,
    foregroundColor: (colors) => colors.page,
  },
  ghost: {
    backgroundColor: (colors) => 'transparent',
    borderColor: (colors) => colors.border,
    foregroundColor: (colors) => colors.text,
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  centeredInner: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  leftInner: {
    justifyContent: 'flex-start',
  },
  decoration: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.55,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 3,
  },
  heading: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subheading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  muted: {
    fontSize: 15,
    lineHeight: 22,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  helper: {
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  button: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
