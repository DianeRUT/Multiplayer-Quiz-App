import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { generateQuizWithAI, createQuiz } from '../../services/quizService';

const CreateQuizScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [aiTopic, setAiTopic] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAddQuestion = () => {
    // Add a new question structure with one correct and three incorrect options
    setQuestions([
      ...questions,
      { text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }
    ]);
  };

  // Handler for question text change
  const handleQuestionTextChange = (text, qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].text = text;
    setQuestions(newQuestions);
  };

  // Handler for option text change
  const handleOptionTextChange = (text, qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = text;
    setQuestions(newQuestions);
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) {
        Alert.alert('Error', 'Please enter a topic for the AI to generate questions.');
        return;
    }
    setIsAiLoading(true);
    try {
        const data = await generateQuizWithAI(aiTopic, 5); // Generate 5 questions by default
        setQuestions(data.questions);
        Alert.alert('Success', 'AI has generated 5 questions for you!');
    } catch (error) {
        Alert.alert('AI Error', error.response?.data?.message || 'Failed to generate quiz with AI.');
    } finally {
        setIsAiLoading(false);
    }
  }

  const handleSaveQuiz = async () => {
    if (!title || !categoryName || questions.length === 0) {
        Alert.alert('Error', 'Please fill in the title, category, and add at least one question.');
        return;
    }
    // Add validation for empty questions/options here if needed
    setIsSaving(true);
    try {
        await createQuiz({ title, categoryName, questions });
        Alert.alert('Success', 'Your quiz has been saved!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    } catch (error) {
        Alert.alert('Save Error', error.response?.data?.message || 'Failed to save the quiz.');
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Quiz</Text>
            <View style={{width: 24}}/>
        </View>

        <AppTextInput placeholder="Quiz Title (e.g., Solar System Trivia)" value={title} onChangeText={setTitle} />
        <AppTextInput placeholder="Category (e.g., Science)" value={categoryName} onChangeText={setCategoryName} />
        
        <View style={styles.aiContainer}>
            <Text style={styles.sectionTitle}>✨ Or Generate with AI</Text>
            <AppTextInput placeholder="Enter topic, e.g., 'World War II'" value={aiTopic} onChangeText={setAiTopic}/>
            <AppButton title="Generate Questions" onPress={handleGenerateAI} loading={isAiLoading} style={{backgroundColor: colors.primary}}/>
        </View>

        <Text style={styles.sectionTitle}>Questions</Text>
        {questions.map((q, qIndex) => (
            <View key={qIndex} style={styles.questionCard}>
                <Text style={styles.questionLabel}>Question {qIndex + 1}</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Type the question here..." 
                    value={q.text}
                    onChangeText={(text) => handleQuestionTextChange(text, qIndex)}
                />
                {q.options.map((opt, oIndex) => (
                    <TextInput 
                        key={oIndex} 
                        style={[styles.input, opt.isCorrect && styles.correctOption]} 
                        placeholder={`Option ${oIndex + 1} ${opt.isCorrect ? '(Correct Answer)' : ''}`}
                        value={opt.text}
                        onChangeText={(text) => handleOptionTextChange(text, qIndex, oIndex)}
                    />
                ))}
            </View>
        ))}

        <TouchableOpacity style={styles.addQuestionButton} onPress={handleAddQuestion}>
            <Ionicons name="add-circle-outline" size={24} color={colors.secondary} />
            <Text style={styles.addQuestionText}>Add Question Manually</Text>
        </TouchableOpacity>

        <AppButton title="Save Quiz" onPress={handleSaveQuiz} loading={isSaving} style={styles.saveButton} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { ...typography.h2 },
  sectionTitle: { ...typography.h3, marginBottom: spacing.md, marginTop: spacing.lg },
  aiContainer: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.lg },
  questionCard: { backgroundColor: colors.card, padding: spacing.md, borderRadius: 12, marginBottom: spacing.md },
  questionLabel: { ...typography.body, fontWeight: 'bold', marginBottom: spacing.sm },
  input: { backgroundColor: colors.darkPurple, padding: spacing.md, borderRadius: 8, color: colors.white, marginBottom: spacing.sm, fontSize: 16 },
  correctOption: { borderColor: colors.secondary, borderWidth: 1.5 },
  addQuestionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: colors.secondary, borderStyle: 'dashed', marginVertical: spacing.md },
  addQuestionText: { ...typography.body, color: colors.secondary, marginLeft: spacing.sm, fontWeight: 'bold' },
  saveButton: { marginVertical: spacing.lg, marginBottom: 50 }
});

export default CreateQuizScreen;