import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const GuestLobbyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { gamePin, nickname } = route.params;
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [quizDetails, setQuizDetails] = useState(null);
  const [players, setPlayers] = useState([]);
  const [countdown, setCountdown] = useState(null);

  // Simulate fetching quiz details
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuizDetails({
        title: "General Knowledge Quiz",
        questionCount: 10,
        timeLimit: 20,
        host: "QuizMaster123"
      });
      setPlayers([
        { id: 1, name: nickname, isYou: true },
        { id: 2, name: "Player2" },
        { id: 3, name: "Player3" },
        { id: 4, name: "Player4" }
      ]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Simulate countdown to quiz start
  useEffect(() => {
    if (!isLoading && quizDetails) {
      let seconds = 10;
      setCountdown(seconds);
      
      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        
        if (seconds <= 0) {
          clearInterval(interval);
          navigation.navigate('GuestQuizScreen', { 
            quizId: `guest_quiz_${gamePin}`,
            nickname
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading, quizDetails]);

  const handleLeaveLobby = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <LinearGradient colors={["#f8fafc", "#e2e8f0", "#cbd5e1"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text style={styles.loadingText}>Joining Game {gamePin}...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#f8fafc", "#e2e8f0", "#cbd5e1"]} style={styles.container}>
      <View style={styles.backgroundShapes}>
        <LinearGradient colors={["#06b6d4", "#67e8f9"]} style={[styles.shape, styles.shape1]} />
        <LinearGradient colors={["#06b6d4", "#67e8f9"]} style={[styles.shape, styles.shape2]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <View style={styles.pinContainer}>
            <Text style={styles.pinLabel}>Game PIN</Text>
            <Text style={styles.pinValue}>{gamePin}</Text>
          </View>
          
          <View style={styles.quizInfoContainer}>
            <Text style={styles.quizTitle}>{quizDetails.title}</Text>
            <View style={styles.quizMeta}>
              <Text style={styles.quizMetaText}>
                <Icon name="help-outline" size={16} color="#64748b" /> {quizDetails.questionCount} questions
              </Text>
              <Text style={styles.quizMetaText}>
                <Icon name="timer" size={16} color="#64748b" /> {quizDetails.timeLimit}s per question
              </Text>
            </View>
            <Text style={styles.hostText}>Hosted by: {quizDetails.host}</Text>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.content}>
          <View style={styles.countdownContainer}>
            <LinearGradient 
              colors={["#06b6d4", "#67e8f9"]} 
              style={styles.countdownCircle}
            >
              <Text style={styles.countdownText}>{countdown}</Text>
              <Text style={styles.countdownLabel}>Starting soon</Text>
            </LinearGradient>
          </View>

          <View style={styles.playersContainer}>
            <Text style={styles.sectionTitle}>Players ({players.length})</Text>
            <View style={styles.playersList}>
              {players.map(player => (
                <View 
                  key={player.id} 
                  style={[
                    styles.playerCard,
                    player.isYou && styles.yourPlayerCard
                  ]}
                >
                  <View style={styles.playerAvatar}>
                    <Icon 
                      name="person" 
                      size={24} 
                      color={player.isYou ? "#ffffff" : "#06b6d4"} 
                    />
                  </View>
                  <Text 
                    style={[
                      styles.playerName,
                      player.isYou && styles.yourPlayerName
                    ]}
                  >
                    {player.name}
                    {player.isYou && " (You)"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animatable.View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.leaveButton} 
        onPress={handleLeaveLobby}
      >
        <Text style={styles.leaveButtonText}>Leave Lobby</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#64748b',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  pinContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  pinLabel: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  pinValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#06b6d4',
    textAlign: 'center',
  },
  quizInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 10,
  },
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  quizMetaText: {
    color: '#64748b',
    fontSize: 14,
  },
  hostText: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: -10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  playersContainer: {
    marginTop: 10,
  },
  playersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playerCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  yourPlayerCard: {
    backgroundColor: '#06b6d4',
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  yourPlayerName: {
    color: '#ffffff',
  },
  leaveButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  leaveButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuestLobbyScreen;