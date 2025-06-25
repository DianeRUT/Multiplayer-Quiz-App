import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QuestionCard } from '../../components';

export const BattleScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Battle in Progress</Text>
      <QuestionCard 
        question="What is the capital of France?"
        category="Geography"
        difficulty="easy"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
}); 