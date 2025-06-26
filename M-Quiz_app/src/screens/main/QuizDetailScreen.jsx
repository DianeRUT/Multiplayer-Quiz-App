import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import { getQuizDetailsById } from '../../services/quizService';
import * as gameService from '../../services/gameService';
import { useGame } from '../../context/GameContext';
import * as Animatable from 'react-native-animatable';

const QuizDetailScreen = ({ route, navigation }) => {
  const { quizId, quizTitle } = route.params;
  const { hostGame } = useGame();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isHostLoading, setIsHostLoading] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const quizDetails = await getQuizDetailsById(quizId);
        setQuiz({
          ...quizDetails,
          questions: Array.isArray(quizDetails.questions) ? quizDetails.questions : [],
        });
      } catch (err) {
        console.error("Failed to fetch quiz details:", err);
        setError('Could not load quiz details. You may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, [quizId]);

  const handleHost = async () => {
    if (!quiz) return;
    setIsHostLoading(true);
    try {
      const { pin } = await gameService.startGameSession(quiz.id);
      hostGame(pin);
    } catch (err) {
      Alert.alert('Error', 'Failed to start game session.');
      setIsHostLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error || !quiz) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || 'Quiz not found.'}</Text>
        </View>
      );
    }

    const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

    return (
      <>
        <ScrollView contentContainerStyle={styles.container}>
          <Animatable.View animation="fadeInDown" duration={600}>
            <View style={styles.quizInfoCard}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="grid-outline" size={16} color={colors.primary} />
                  <Text style={styles.quizMeta}>{quiz.category?.name || 'General'}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="help-circle-outline" size={16} color={colors.primary} />
                  <Text style={styles.quizMeta}>{questionCount} Questions</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="person-circle-outline" size={16} color={colors.primary} />
                  <Text style={styles.quizMeta}>{quiz.creator?.name || 'Anonymous'}</Text>
                </View>
              </View>
            </View>
          </Animatable.View>

          <Animatable.Text animation="fadeIn" delay={200} style={styles.questionsHeader}>
            Questions & Answers
          </Animatable.Text>

          {Array.isArray(quiz.questions) && quiz.questions.map((question, index) => (
            <Animatable.View key={question.id} animation="fadeInUp" delay={index * 100} style={styles.questionCard}>
              <Text style={styles.questionText}>{index + 1}. {question.text}</Text>
              <View style={styles.optionsContainer}>
                {Array.isArray(question.options) && question.options.map((option) => (
                  <View
                    key={option.id}
                    style={[styles.optionChip, option.isCorrect && styles.correctOptionChip]}
                  >
                    <Ionicons
                      name={option.isCorrect ? "checkmark-circle" : "ellipse-outline"}
                      size={20}
                      color={option.isCorrect ? colors.secondary : colors.gray}
                      style={{ marginRight: spacing.sm }}
                    />
                    <Text style={[styles.optionText, option.isCorrect && styles.correctOptionText]}>
                      {option.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Animatable.View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <AppButton
            title="Host this Quiz"
            onPress={handleHost}
            loading={isHostLoading}
            icon={<Ionicons name="game-controller" size={20} color="white" style={{ marginRight: 8 }} />}
          />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{quizTitle || 'Quiz Details'}</Text>
        <View style={{ width: 24 }} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f5f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {},
  headerTitle: {
    ...typography.h2,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm
  },
  container: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.h3,
    color: colors.error,
    textAlign: 'center',
    padding: spacing.xl
  },
  quizInfoCard: {
    backgroundColor: 'white',
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizTitle: {
    ...typography.h2,
    color: '#333',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizMeta: {
    ...typography.caption,
    color: colors.gray,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  questionsHeader: {
    ...typography.h3,
    fontSize: 18,
    color: '#444',
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  questionCard: {
    backgroundColor: 'white',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#eee',
  },
  questionText: {
    ...typography.h3,
    color: '#333',
    fontSize: 18,
    marginBottom: spacing.md,
    lineHeight: 26,
  },
  optionsContainer: {
    marginTop: spacing.sm,
  },
  optionChip: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  correctOptionChip: {
    backgroundColor: 'rgba(28, 200, 138, 0.1)',
    borderColor: colors.secondary,
  },
  optionText: {
    ...typography.body,
    color: '#555',
    fontSize: 16,
    flex: 1,
  },
  correctOptionText: {
    fontWeight: 'bold',
    color: colors.secondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
});

export default QuizDetailScreen;
