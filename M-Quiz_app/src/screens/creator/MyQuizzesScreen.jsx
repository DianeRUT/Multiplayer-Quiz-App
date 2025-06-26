import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getMyQuizzes } from '../../services/quizService';
import * as gameService from '../../services/gameService';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';

const MyQuizzesScreen = ({ navigation }) => {
  const { hostGame } = useGame();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostLoadingId, setHostLoadingId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadQuizzes = async () => {
        setLoading(true);
        try {
          const myQuizzes = await getMyQuizzes();
          console.log("Fetched quizzes:", myQuizzes); // Debugging log
          setQuizzes(myQuizzes);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadQuizzes();
    }, [])
  );

  const handleStartGame = async (quiz) => {
    setHostLoadingId(quiz.id);
    try {
      const { pin } = await gameService.startGameSession(quiz.id);
      hostGame(pin);
    } catch (err) {
      Alert.alert('Error', 'Failed to start game session. Please try again.');
      setHostLoadingId(null);
    }
  };

  const renderQuizItem = ({ item }) => (
    <View style={styles.quizCard}>
      <View style={styles.quizDetails}>
        <Text style={styles.quizTitle}>{item.title}</Text>
        <Text style={styles.quizInfo}>
          {(Array.isArray(item.questions) ? item.questions.length : 0)} Questions | {item.status}
        </Text>
      </View>
      <AppButton
        title="Host"
        onPress={() => handleStartGame(item)}
        style={styles.hostButton}
        textStyle={styles.hostButtonText}
        loading={hostLoadingId === item.id}
        disabled={hostLoadingId !== null}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>My Quizzes</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.white} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={quizzes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderQuizItem}
          contentContainerStyle={{ padding: spacing.md }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={60} color={colors.textMuted} />
              <Text style={styles.emptyText}>You haven't created any quizzes yet.</Text>
            </View>
          }
        />
      )}

      <AppButton
        title="+ Create New Quiz"
        onPress={() => navigation.navigate('CreateQuiz')}
        style={{ margin: spacing.md }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  title: {
    ...typography.h2,
  },
  quizCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizDetails: {
    flex: 1,
    marginRight: spacing.md,
  },
  quizTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  quizInfo: {
    ...typography.caption,
  },
  hostButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
  },
  hostButtonText: {
    fontSize: 14,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

export default MyQuizzesScreen;
