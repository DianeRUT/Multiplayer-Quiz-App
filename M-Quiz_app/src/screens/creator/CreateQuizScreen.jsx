import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { generateQuizWithAI, createQuiz, getAllCategories } from '../../services/quizService';
import * as Animatable from 'react-native-animatable';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Reusable accordion for each question
const QuestionAccordion = ({
  q, qIndex, onRemove, onQuestionChange, onOptionChange,
  onCorrectChange, onToggle, isExpanded
}) => {
  return (
    <Animatable.View animation="fadeInUp" duration={400} style={styles.questionCard}>
      <TouchableOpacity onPress={onToggle} style={styles.questionCardHeader}>
        <Text style={styles.questionNumber}>{q.text || `Question ${qIndex + 1}`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => onRemove(qIndex)} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={22} color={colors.primary} />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.questionBody}>
          <AppTextInput
            label="Question Text"
            placeholder="Type the question here..."
            value={q.text}
            onChangeText={(text) => onQuestionChange(text, qIndex)}
            multiline
          />
          <Text style={styles.optionsLabel}>Options</Text>
          {q.options.map((opt, oIndex) => (
            <View key={oIndex} style={styles.optionContainer}>
              <TouchableOpacity onPress={() => onCorrectChange(qIndex, oIndex)} style={styles.radioButton}>
                <Ionicons
                  name={opt.isCorrect ? 'radio-button-on' : 'radio-button-off'}
                  size={24}
                  color={opt.isCorrect ? colors.primary : colors.gray}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <AppTextInput
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt.text}
                  onChangeText={(text) => onOptionChange(text, qIndex, oIndex)}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </Animatable.View>
  );
};

const CreateQuizScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [aiTopic, setAiTopic] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(0);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(setAvailableCategories).catch(console.error);
  }, []);

  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      text: '',
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setExpandedQuestionIndex(newQuestions.length - 1);
  };

  const handleRemoveQuestion = (qIndex) => {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = questions.filter((_, index) => index !== qIndex);
          setQuestions(updated);
          setExpandedQuestionIndex(null);
        },
      },
    ]);
  };

  const handleQuestionTextChange = (text, qIndex) => {
    const updated = [...questions];
    updated[qIndex].text = text;
    setQuestions(updated);
  };

  const handleOptionTextChange = (text, qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = text;
    setQuestions(updated);
  };

  const handleSetCorrectOption = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].options.forEach((opt, index) => {
      opt.isCorrect = index === oIndex;
    });
    setQuestions(updated);
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) {
      Alert.alert('Please enter a topic');
      return;
    }
    setIsAiLoading(true);
    try {
      const data = await generateQuizWithAI(aiTopic, 5);
      setQuestions(data.questions);
      setExpandedQuestionIndex(0);
      Alert.alert('AI Success', `Generated 5 questions on "${aiTopic}"`);
    } catch (error) {
      Alert.alert('AI Error', error.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!title || !categoryName || questions.length === 0) {
      Alert.alert('Missing Fields', 'Please provide a title, category, and at least one question.');
      return;
    }
    setIsSaving(true);
    try {
      await createQuiz({ title, categoryName, questions });
      Alert.alert('Success', 'Quiz saved successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Quiz save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Quiz</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <AppTextInput
          label="Quiz Title"
          placeholder="Enter quiz title..."
          value={title}
          onChangeText={setTitle}
        />
        <AppTextInput
          label="Category"
          placeholder="Enter category..."
          value={categoryName}
          onChangeText={setCategoryName}
        />
        <AppTextInput
          label="✨ AI Topic (optional)"
          placeholder="e.g. Rwanda history"
          value={aiTopic}
          onChangeText={setAiTopic}
        />
        <AppButton title="Generate Questions with AI" onPress={handleGenerateAI} loading={isAiLoading} />

        <View style={{ marginTop: spacing.md }}>
          {questions.map((q, index) => (
            <QuestionAccordion
              key={index}
              q={q}
              qIndex={index}
              isExpanded={expandedQuestionIndex === index}
              onToggle={() => toggleAccordion(index)}
              onRemove={handleRemoveQuestion}
              onQuestionChange={handleQuestionTextChange}
              onOptionChange={handleOptionTextChange}
              onCorrectChange={handleSetCorrectOption}
            />
          ))}
        </View>

        <AppButton title="Add Question" onPress={handleAddQuestion} style={{ marginTop: spacing.md }} />
        <AppButton title="Save Quiz" onPress={handleSaveQuiz} loading={isSaving} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  title: { ...typography.h2, color: '#1e293b', fontWeight: 'bold' },
  content: { padding: spacing.md, paddingBottom: 100 },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  questionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  questionNumber: { ...typography.h3, color: '#1e293b', flex: 1 },
  iconButton: { padding: spacing.sm, marginLeft: spacing.sm },
  questionBody: { padding: spacing.md, borderTopWidth: 1, borderColor: '#e2e8f0' },
  optionsLabel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  optionContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  radioButton: { paddingRight: spacing.sm },
});

export default CreateQuizScreen;
