import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from "react-native-animatable"
import { useAuth } from "../../context/AuthContext"

export default function AuthScreen({ navigation, route }) {
  // Determine if we're in login or register mode based on route params
  const initialMode = route.params?.mode || 'login'
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const handleAuth = async () => {
    if (isLogin) {
      if (!email || !password) {
        setError('Please fill in all fields.')
        return
      }

      setLoading(true)
      setError('')
      try {
        await login({ email, password })
      } catch (e) {
        setError(e.response?.data?.message || 'Login failed. Please check your credentials.')
      } finally {
        setLoading(false)
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields.')
        return
      }

      setLoading(true)
      setError('')
      try {
        await register({ name, email, password, role: 'PLAYER' })
        Alert.alert(
          'Registration Successful',
          'Please check your email to verify your account before logging in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        )
      } catch (e) {
        setError(e.response?.data?.message || 'Registration failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleMode = () => {
    const newMode = !isLogin
    setIsLogin(newMode)
    setError('')
    setName("")
    setEmail("")
    setPassword("")
    // Update the route to reflect the current mode
    navigation.setParams({ mode: newMode ? 'login' : 'register' })
  }

  const handleGuestEntry = () => {
    navigation.navigate('QuickPlay')
  }


  return (
    <LinearGradient colors={["#f8fafc", "#e2e8f0", "#cbd5e1"]} style={styles.container}>
      <View style={styles.backgroundShapes}>
        <LinearGradient colors={["#8b5cf6", "#a78bfa"]} style={[styles.shape, styles.shape1]} />
        <LinearGradient colors={["#ec4899", "#f472b6"]} style={[styles.shape, styles.shape2]} />
        <LinearGradient colors={["#06b6d4", "#67e8f9"]} style={[styles.shape, styles.shape3]} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Guest Entry Button */}
          <TouchableOpacity 
            style={styles.guestButton} 
            onPress={handleGuestEntry}
          >
            <Text style={styles.guestButtonText}>Enter Game PIN</Text>
            <Ionicons name="arrow-forward" size={18} color="#8b5cf6" />
          </TouchableOpacity>

          <Animatable.View animation="fadeInDown" delay={200} style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={isLogin ? ["#8b5cf6", "#a78bfa"] : ["#ec4899", "#f472b6"]}
                style={styles.logoGradient}
              >
                <Icon name={isLogin ? "psychology" : "person-add"} size={28} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>{isLogin ? "Welcome back" : "Create account"}</Text>
            <Text style={styles.subtitle}>
              {isLogin ? "Sign in to create & host quizzes" : "Join QuizBattle today"}
            </Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400} style={styles.authCard}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.activeToggle]}
                onPress={() => !isLogin && toggleMode()}
              >
                <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.activeToggle]}
                onPress={() => isLogin && toggleMode()}
              >
                <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <Animatable.View key={isLogin ? "login" : "register"} animation="fadeIn" duration={300}>
              {/* Name for register */}
              {!isLogin && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <Icon name="person" size={20} color="#94a3b8" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your full name"
                      placeholderTextColor="#94a3b8"
                      editable={!loading}
                    />
                  </View>
                </View>
              )}

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputContainer}>
                  <Icon name="email" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Icon name="lock" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    editable={!loading}
                  />
                </View>
              </View>
            </Animatable.View>

            {/* Forgot Password */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {/* Auth Button */}
            <TouchableOpacity
              style={[styles.authButton, loading && styles.disabledButton]}
              onPress={handleAuth}
              disabled={loading}
            >
              <LinearGradient
                colors={isLogin ? ["#8b5cf6", "#a78bfa"] : ["#ec4899", "#f472b6"]}
                style={styles.authButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.authButtonText}>
                      {isLogin ? "Sign in" : "Create account"}
                    </Text>
                    <Icon name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Alternative Action */}
            <View style={styles.alternativeContainer}>
              <Text style={styles.alternativeText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={styles.alternativeLink}>{isLogin ? "Sign up" : "Sign in"}</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundShapes: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  shape: {
    position: "absolute",
    borderRadius: 100,
    opacity: 0.1,
  },
  shape1: {
    width: 200,
    height: 200,
    top: "10%",
    right: "-10%",
  },
  shape2: {
    width: 150,
    height: 150,
    top: "60%",
    left: "-15%",
  },
  shape3: {
    width: 120,
    height: 120,
    bottom: "15%",
    right: "10%",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  guestButton: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
    marginRight: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  authCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeToggle: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeToggleText: {
    color: "#1e293b",
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1e293b",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  authButton: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  authButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  alternativeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  alternativeText: {
    fontSize: 14,
    color: "#64748b",
  },
  alternativeLink: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "600",
  },
})