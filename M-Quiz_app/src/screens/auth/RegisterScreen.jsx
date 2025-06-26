import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import { colors, spacing, typography } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, role: 'PLAYER' }); // Default role
      Alert.alert(
        'Registration Successful',
        'Please check your email to verify your account before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        <AppTextInput placeholder="Full Name" value={name} onChangeText={setName} />
        <AppTextInput placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
        <AppTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <AppButton title="Create Account" onPress={handleRegister} loading={loading} style={{marginTop: spacing.md}} />
        
        <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  backButton: { position: 'absolute', top: 60, left: spacing.lg, zIndex: 1 },
  container: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.xl },
  errorText: { color: colors.pink, textAlign: 'center', marginVertical: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl },
  footerText: { ...typography.body, color: colors.textMuted },
  linkText: { ...typography.body, color: colors.secondary, fontWeight: 'bold' },
});

export default RegisterScreen;