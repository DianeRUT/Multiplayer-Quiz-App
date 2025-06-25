import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QuestionCardProps {
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  category,
  difficulty,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{category}</Text>
        <Text style={[styles.difficulty, styles[difficulty]]}>
          {difficulty.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.question}>{question}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  easy: {
    backgroundColor: '#28A745',
    color: '#FFFFFF',
  },
  medium: {
    backgroundColor: '#FFC107',
    color: '#000000',
  },
  hard: {
    backgroundColor: '#DC3545',
    color: '#FFFFFF',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    lineHeight: 24,
  },
}); 