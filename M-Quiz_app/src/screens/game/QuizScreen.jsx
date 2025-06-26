import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import * as Progress from 'react-native-progress';

const QuizScreen = () => {
  const { gameState, submitAnswer } = useGame();
  const { currentQuestion } = gameState;
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 10);

  // Effect to reset state for each new question
  useEffect(() => {
    if (currentQuestion) {
        setSelectedOption(null); // Clear previous selection
        setTimeLeft(currentQuestion.timeLimit || 10); // Reset timer
    }
  }, [currentQuestion]);

  // Effect to handle the countdown timer
  useEffect(() => {
    if (!currentQuestion || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion]);

  const handleSelectOption = (option) => {
    if (selectedOption) return; // Prevent changing answer
    setSelectedOption(option);
    submitAnswer({ optionText: option.text }); // Call context function to emit answer
  };

  // Show a loading/waiting state if there is no question yet
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
            <ActivityIndicator color={colors.white} size="large" />
            <Text style={styles.questionText}>Waiting for question...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Determines the style of the option button based on selection state
  const getOptionStyle = (option) => {
    if (!selectedOption) return styles.option;
    // Highlight the selected option
    if (option.text === selectedOption.text) return [styles.option, styles.selectedOption];
    // Dim the other options
    return [styles.option, styles.disabledOption];
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.timerText}>{timeLeft}</Text>
            <Progress.Bar progress={timeLeft / (currentQuestion.timeLimit || 10)} width={null} style={styles.progressBar} color={colors.secondary}/>
        </View>
        
        <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={getOptionStyle(option)} 
              onPress={() => handleSelectOption(option)} 
              disabled={!!selectedOption}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: spacing.md, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginVertical: spacing.md },
  timerText: { ...typography.h1, marginBottom: spacing.sm },
  progressBar: { width: '100%', height: 10, backgroundColor: colors.card },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.lg
  },
  questionText: { ...typography.h2, textAlign: 'center' },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  option: {
    backgroundColor: colors.primary,
    width: '48%',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedOption: {
      borderColor: colors.secondary,
      borderWidth: 3,
  },
  disabledOption: {
      opacity: 0.5,
  },
  optionText: { ...typography.body, fontWeight: 'bold', textAlign: 'center' },
});

export default QuizScreen;