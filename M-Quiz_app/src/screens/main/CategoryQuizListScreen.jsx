import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableQuizzes } from '../../services/quizService';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import * as Animatable from 'react-native-animatable';

const CATEGORY_ICONS = {
  'science': 'flask-outline',
  'history': 'library-outline',
  'sports': 'basketball-outline',
  'geography': 'map-outline',
  'movies': 'film-outline',
  'music': 'musical-notes-outline',
  'technology': 'hardware-chip-outline',
  'general': 'help-circle-outline'
};

const QuizListItem = ({ quiz, navigation, categoryName, index }) => {
  const iconName = CATEGORY_ICONS[categoryName?.toLowerCase()] || CATEGORY_ICONS['general'];

  const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;

  return (
    <Animatable.View animation="fadeInUp" duration={500} delay={index * 100}>
      <TouchableOpacity
        style={styles.quizCard}
        onPress={() => navigation.navigate('QuizDetail', { quizId: quiz.id, quizTitle: quiz.title })}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={28} color={colors.primary} />
        </View>
        <View style={styles.quizDetails}>
          <Text style={styles.quizTitle} numberOfLines={2}>{quiz.title}</Text>
          <Text style={styles.quizInfo}>
            {questionCount} Questions • By {quiz.creator?.name || 'Anonymous'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.gray} />
      </TouchableOpacity>
    </Animatable.View>
  );
};

const CategoryQuizListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError('');
      try {
        const categoryQuizzes = await getAvailableQuizzes(categoryId);
        setQuizzes(categoryQuizzes || []);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError('Could not load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [categoryId]);

  const handleCreateQuiz = () => {
    navigation.navigate('CreateQuiz', { prefilledCategory: categoryName });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!quizzes || quizzes.length === 0) {
      return (
        <Animatable.View animation="fadeInUp" style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="search-outline" size={60} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Nothing Here Yet!</Text>
          <Text style={styles.emptySubtitle}>
            Be the first to create a quiz in the "{categoryName}" category.
          </Text>
          <AppButton
            title="Create a Quiz"
            onPress={handleCreateQuiz}
            style={{ marginTop: spacing.lg }}
            icon={<Ionicons name="add" size={20} color="white" style={{ marginRight: 8 }} />}
          />
        </Animatable.View>
      );
    }

    return (
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <QuizListItem
            quiz={item}
            navigation={navigation}
            categoryName={categoryName}
            index={index}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{categoryName}</Text>
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
  listContainer: { padding: spacing.md },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    paddingHorizontal: spacing.lg
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: -50,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: '#333',
    textAlign: 'center'
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.sm
  },
  quizCard: {
    backgroundColor: 'white',
    padding: spacing.md,
    borderRadius: 16,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#eef0f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  quizDetails: {
    flex: 1,
    marginRight: spacing.md
  },
  quizTitle: {
    ...typography.h3,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: spacing.xs
  },
  quizInfo: {
    ...typography.caption,
    color: colors.gray
  },
});

export default CategoryQuizListScreen;
