import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmail, signInWithGoogle, registerWithEmail } from '../../src/services/auth.service';
import { colors, typography, spacing, borderRadius } from '../../src/theme';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;

function validate(mode, fields) {
  const errors = {};

  if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (fields.password.length < PASSWORD_MIN) {
    errors.password = `Password must be at least ${PASSWORD_MIN} characters`;
  }

  if (mode === 'register') {
    if (!fields.displayName || fields.displayName.trim().length < 2) {
      errors.displayName = 'Name must be at least 2 characters';
    }
    if (!/[A-Z]/.test(fields.password)) {
      errors.password = (errors.password ? errors.password + '\n' : '') + 'Must contain an uppercase letter';
    }
    if (!/[0-9]/.test(fields.password)) {
      errors.password = (errors.password ? errors.password + '\n' : '') + 'Must contain a number';
    }
    if (!/[^A-Za-z0-9]/.test(fields.password)) {
      errors.password = (errors.password ? errors.password + '\n' : '') + 'Must contain a special character';
    }
    if (fields.password !== fields.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return errors;
}

function InputField({ label, value, onChangeText, error, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={label}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const set = (key) => (val) => setFields(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    const errs = validate(mode, fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(fields.email, fields.password);
      } else {
        await registerWithEmail(fields.email, fields.password, fields.displayName.trim());
      }
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      const msg = error.code === 'auth/email-already-in-use'
        ? 'This email is already registered.'
        : error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
        ? 'Invalid email or password.'
        : error.code === 'auth/too-many-requests'
        ? 'Too many attempts. Try again later.'
        : error.message;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setErrors({});
    setFields({ displayName: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>BioHarvest</Text>
        <Text style={styles.subtitle}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => { setMode('login'); setErrors({}); }}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => { setMode('register'); setErrors({}); }}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Register</Text>
          </TouchableOpacity>
        </View>

        {mode === 'register' && (
          <InputField
            label="Full Name"
            value={fields.displayName}
            onChangeText={set('displayName')}
            error={errors.displayName}
            autoCapitalize="words"
          />
        )}

        <InputField
          label="Email"
          value={fields.email}
          onChangeText={set('email')}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Password"
          value={fields.password}
          onChangeText={set('password')}
          error={errors.password}
          secureTextEntry={!showPassword}
        />

        {mode === 'register' && (
          <InputField
            label="Confirm Password"
            value={fields.confirmPassword}
            onChangeText={set('confirmPassword')}
            error={errors.confirmPassword}
            secureTextEntry={!showPassword}
          />
        )}

        {mode === 'register' && (
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.showPassword}>
            <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'} password</Text>
          </TouchableOpacity>
        )}

        {mode === 'register' && (
          <View style={styles.requirements}>
            <Text style={styles.reqTitle}>Password requirements:</Text>
            <Text style={styles.reqItem}>• At least 8 characters</Text>
            <Text style={styles.reqItem}>• One uppercase letter</Text>
            <Text style={styles.reqItem}>• One number</Text>
            <Text style={styles.reqItem}>• One special character</Text>
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogle} disabled={loading}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: typography.fontSizeXXL, fontWeight: typography.fontWeightBold, color: colors.primary, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { fontSize: typography.fontSizeMD, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  tabRow: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.full, padding: 4, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.full, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: typography.fontSizeSM, fontWeight: typography.fontWeightSemiBold, color: colors.textMuted },
  tabTextActive: { color: '#000' },
  fieldWrap: { marginBottom: spacing.sm },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, fontSize: typography.fontSizeMD },
  inputError: { borderColor: colors.danger },
  errorText: { fontSize: typography.fontSizeXS, color: colors.danger, marginTop: 4, marginLeft: 4 },
  showPassword: { alignItems: 'flex-end', marginBottom: spacing.sm },
  showPasswordText: { fontSize: typography.fontSizeXS, color: colors.primary },
  requirements: { backgroundColor: colors.surfaceElevated, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  reqTitle: { fontSize: typography.fontSizeXS, color: colors.textSecondary, fontWeight: typography.fontWeightSemiBold, marginBottom: spacing.xs },
  reqItem: { fontSize: typography.fontSizeXS, color: colors.textMuted, marginTop: 2 },
  primaryButton: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center', marginTop: spacing.sm },
  primaryButtonText: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightBold, color: '#000' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, marginHorizontal: spacing.sm },
  googleButton: { backgroundColor: colors.surfaceElevated, paddingVertical: spacing.md, borderRadius: borderRadius.full, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  googleButtonText: { fontSize: typography.fontSizeMD, fontWeight: typography.fontWeightMedium, color: colors.textPrimary },
});