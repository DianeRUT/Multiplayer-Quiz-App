import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getMyQuizzes } from '../../services/quizService';
import * as gameService from '../../services/gameService';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const MyQuizzesScreen = ({ navigation }) => {
  const { hostGame } = useGame();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostLoadingId, setHostLoadingId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getMyQuizzes()
        .then(setQuizzes)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, [])
  );

  const handleStartGame = async (quiz) => {
    setHostLoadingId(quiz.id);
    try {
      const { pin } = await gameService.startGameSession(quiz.id);
      hostGame(pin);
      navigation.navigate('GameLobby', { pin, isHost: true });
    } catch (err) {
      Alert.alert('Error', 'Failed to start game session.');
    } finally {
      setHostLoadingId(null);
    }
  };

  const renderQuizItem = ({ item }) => (
    <Animatable.View 
      animation="fadeInUp"
      duration={600}
      style={styles.quizCard}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('QuizDetail', { quizId: item.id, quizTitle: item.title })}
        style={styles.quizContent}
      >
        <View style={styles.quizDetails}>
          <Text style={styles.quizTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.quizMeta}>
            <Text style={styles.quizInfo}>
              {(Array.isArray(item.questions) ? item.questions.length : 0)} Questions
            </Text>
            <View style={[
              styles.statusBadge,
              item.status === 'published' ? styles.publishedBadge : styles.draftBadge
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <AppButton
        title="Host"
        onPress={(e) => {
          e.stopPropagation();
          handleStartGame(item);
        }}
        style={styles.hostButton}
        textStyle={styles.hostButtonText}
        loading={hostLoadingId === item.id}
        disabled={hostLoadingId !== null}
        color="#9575cd" // Subtle purple
      />
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Animatable.Text 
            animation="fadeInRight"
            duration={500}
            style={styles.title}
          >
            My Quizzes
          </Animatable.Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#9575cd" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={quizzes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderQuizItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Animatable.View 
                animation="fadeIn"
                duration={800}
                style={styles.emptyContainer}
              >
                <Ionicons 
                  name="document-text-outline" 
                  size={60} 
                  color="#e0e0e0" 
                />
                <Text style={styles.emptyText}>You haven't created any quizzes yet.</Text>
                <Text style={styles.emptySubtext}>Tap the button below to create your first quiz</Text>
              </Animatable.View>
            }
          />
        )}

        <Animatable.View 
          animation="fadeInUp"
          duration={800}
          delay={200}
          style={styles.footer}
        >
          <AppButton 
            title="Create New Quiz" 
            onPress={() => navigation.navigate('CreateQuiz')} 
            style={styles.createButton}
            color="#9575cd" // Subtle purple
            icon={<Ionicons name="add" size={24} color="white" />}
          />
        </Animatable.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  title: { 
    ...typography.h1, 
    color: '#333',
    fontSize: 28,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  quizContent: {
    flex: 1,
    marginRight: spacing.md,
    padding: spacing.lg,
  },
  quizDetails: {
    flex: 1,
  },
  quizTitle: { 
    ...typography.h3, 
    marginBottom: spacing.sm, 
    color: '#333',
    fontWeight: '600',
    fontSize: 18,
  },
  quizMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizInfo: { 
    ...typography.caption, 
    color: '#757575',
    marginRight: spacing.sm,
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  publishedBadge: {
    backgroundColor: 'rgba(149, 117, 205, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(149, 117, 205, 0.3)',
  },
  draftBadge: {
    backgroundColor: 'rgba(189, 189, 189, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(189, 189, 189, 0.3)',
  },
  statusText: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '600',
  },
  hostButton: { 
    paddingHorizontal: spacing.lg, 
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginRight: spacing.md,
    backgroundColor: '#9575cd',
  },
  hostButtonText: { 
    fontSize: 14, 
    fontWeight: '600',
    color: 'white',
  },
  emptyContainer: { 
    marginTop: 100, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: spacing.lg,
  },
  emptyText: { 
    ...typography.h3, 
    color: '#757575', 
    textAlign: 'center', 
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    ...typography.body,
    color: '#bdbdbd',
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 14,
  },
  createButton: {
    margin: spacing.md,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    backgroundColor: '#9575cd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: spacing.md,
    backgroundColor: 'transparent',
  },
});

export default MyQuizzesScreen;