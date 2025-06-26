import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import { colors, spacing, typography } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true); setError('');
    try {
      await login({ email, password });
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* NEW: Button for guests */}
        <TouchableOpacity style={styles.guestButton} onPress={() => navigation.navigate('GuestJoin')}>
            <Text style={styles.guestButtonText}>Enter Game PIN</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.secondary} />
        </TouchableOpacity>

        <View style={styles.mainContent}>
            <Text style={styles.title}>Q.</Text>
            <Text style={styles.appName}>QuizON</Text>
            <Text style={styles.subtitle}>Sign in to create quizzes</Text>
            
            <AppTextInput placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <AppTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <AppButton title="Sign In" onPress={handleLogin} loading={loading} style={{backgroundColor: colors.blue}} />
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Create one</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  container: { flexGrow: 1, justifyContent: 'space-between' },
  guestButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    margin: spacing.md,
  },
  guestButtonText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.secondary,
    marginRight: spacing.sm,
  },
  mainContent: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.lg,
  },
  title: { ...typography.h1, fontSize: 60, color: colors.white, textAlign: 'center', lineHeight: 60},
  appName: { ...typography.h2, textAlign: 'center', marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  errorText: { color: colors.pink, textAlign: 'center', marginVertical: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl },
  footerText: { ...typography.body, color: colors.textMuted },
  linkText: { ...typography.body, color: colors.secondary, fontWeight: 'bold' },
});

export default LoginScreen;