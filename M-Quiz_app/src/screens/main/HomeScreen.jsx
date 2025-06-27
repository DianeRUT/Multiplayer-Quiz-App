import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"
import * as Animatable from "react-native-animatable"

import { useAuth } from "../../context/AuthContext"
import { getAllCategories } from "../../services/quizService"
import { colors } from "../../theme/theme"

const cardColors = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"]

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ quizzesPlayed: 24, wins: 12, score: 1980 })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetched = await getAllCategories()
        setCategories(fetched)
      } catch (error) {
        console.log("Failed to fetch categories", error)
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryQuizList", {
      categoryId: category.id,
      categoryName: category.name,
    })
  }

  const handleJoinGamePress = () => navigation.navigate("JoinGame")
  const handleHostGamePress = () => navigation.navigate("MyQuizzes")

  return (
    <LinearGradient colors={["#f8fafc", "#e2e8f0", "#cbd5e1"]} style={styles.container}>
      <View style={styles.backgroundShapes}>
        <LinearGradient colors={["#8b5cf6", "#a78bfa"]} style={[styles.shape, styles.shape1]} />
        <LinearGradient colors={["#ec4899", "#f472b6"]} style={[styles.shape, styles.shape2]} />
        <LinearGradient colors={["#06b6d4", "#67e8f9"]} style={[styles.shape, styles.shape3]} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={["#8b5cf6", "#a78bfa"]} style={styles.logoGradient}>
                <Icon name="psychology" size={20} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View>
              <Text style={styles.headerTitle}>QuizBattle</Text>
              <View style={styles.eloContainer}>
                <Icon name="person" size={12} color="#f59e0b" />
                <Text style={styles.eloText}>{user?.username || "Guest"}</Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 24, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <Animatable.View animation="fadeInDown" style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back, {user?.name || "Creator"}!</Text>
            <Text style={styles.welcomeSubtitle}>Explore quiz categories and start learning!</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: "#8b5cf6" }]}> <Icon name="quiz" size={28} color="#fff" /> <Text style={styles.statNumber}>{stats.quizzesPlayed}</Text> <Text style={styles.statLabel}>Quizzes Played</Text> </View>
            <View style={[styles.statCard, { backgroundColor: "#06b6d4" }]}> <Icon name="emoji-events" size={28} color="#fff" /> <Text style={styles.statNumber}>{stats.wins}</Text> <Text style={styles.statLabel}>Wins</Text> </View>
            <View style={[styles.statCard, { backgroundColor: "#f59e0b" }]}> <Icon name="star" size={28} color="#fff" /> <Text style={styles.statNumber}>{stats.score}</Text> <Text style={styles.statLabel}>Total Score</Text> </View>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={400} style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient colors={["#8b5cf6", "#a78bfa"]} style={styles.cardIcon}>
                <Icon name="category" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.cardTitle}>Explore Categories</Text>
            </View>

            <View style={styles.cardGrid}>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryCard, { backgroundColor: cardColors[index % cardColors.length] }]}
                  onPress={() => handleCategoryPress(cat)}
                >
                  <Icon name="category" size={24} color="#fff" />
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={600} style={styles.card}>
            <View style={styles.cardHeader}>
              <LinearGradient colors={["#06b6d4", "#67e8f9"]} style={styles.cardIcon}>
                <Icon name="group-add" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.cardTitle}>Join Game</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleJoinGamePress}>
              <LinearGradient colors={["#06b6d4", "#67e8f9"]} style={styles.buttonGradient}>
                <Icon name="login" size={18} color="#FFFFFF" />
                <Text style={styles.buttonText}>Join Game</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

          <TouchableOpacity style={styles.hostButton} onPress={handleHostGamePress}>
            <LinearGradient colors={["#ec4899", "#f472b6"]} style={styles.hostButtonGradient}>
              <Icon name="group" size={20} color="#fff" />
              <Text style={styles.hostButtonText}>Host a Game</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundShapes: { position: "absolute", width: "100%", height: "100%" },
  shape: { position: "absolute", borderRadius: 100, opacity: 0.08 },
  shape1: { width: 200, height: 200, top: "5%", right: "-10%" },
  shape2: { width: 150, height: 150, top: "50%", left: "-15%" },
  shape3: { width: 120, height: 120, bottom: "15%", right: "10%" },
  safeArea: { flex: 1, zIndex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoContainer: { marginRight: 12 },
  logoGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  eloContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  eloText: { color: "#d97706", fontSize: 10, fontWeight: "600", marginLeft: 4 },
  welcomeSection: { marginBottom: 32 },
  welcomeTitle: { fontSize: 24, fontWeight: "700", color: "#1e293b", marginBottom: 8 },
  welcomeSubtitle: { fontSize: 16, color: "#64748b" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statNumber: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 8, marginBottom: 4 },
  statLabel: { color: "#fff", fontSize: 14, fontWeight: "600" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 16 },
  categoryCard: {
    width: "47%",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryName: { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#FFFFFF", textAlign: "center" },
  actionButton: {
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#06b6d4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginLeft: 8 },
  hostButton: {
    marginTop: 16,
    borderRadius: 20,
    marginHorizontal: 24,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  hostButtonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 20,
  },
  hostButtonText: { fontSize: 18, fontWeight: "700", color: "#fff", marginLeft: 8 },
})

export default HomeScreen
