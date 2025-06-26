import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme/theme';
import Header from '../../components/Header';
import QuizCard from '../../components/QuizCard';
import CategoryChip from '../../components/CategoryChip';
import { getAllCategories } from '../../services/quizService';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getAllCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.log("Could not fetch categories", error);
            // Fallback to dummy data on error
            setCategories([
                { id: 1, name: 'Random Quiz' }, { id: 2, name: 'Space' },
                { id: 3, name: 'Sports' }, { id: 4, name: 'History' },
                { id: 5, name: 'Maths' }
            ]);
        }
    };
    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Header user={user} />

        <View style={styles.modesContainer}>
          <QuizCard title="Solo Mode" icon="person" color={colors.pink} onPress={() => alert('Solo mode coming soon!')}/>
          <QuizCard title="Multiplayer Mode" icon="people" color={colors.blue} onPress={() => navigation.navigate('JoinGame')}/>
          <QuizCard title="1 Vs. 1 Mode" icon="flash" color={colors.secondary} onPress={() => alert('1v1 coming soon!')}/>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Categories</Text>
            <TouchableOpacity><Text style={styles.viewAll}>VIEW ALL</Text></TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
            {categories.map(cat => <CategoryChip key={cat.id} title={cat.name} />)}
        </View>
        
        {user?.role === 'CREATOR' && (
             <TouchableOpacity style={styles.hostButton} onPress={() => navigation.navigate('MyQuizzes')}>
                <Text style={styles.hostButtonText}>Host a Game</Text>
             </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

// Styles from previous response are correct
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { paddingHorizontal: spacing.md },
  modesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3 },
  viewAll: { ...typography.caption, color: colors.secondary },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hostButton: {
      backgroundColor: colors.primary,
      padding: spacing.md,
      borderRadius: 12,
      marginTop: spacing.xl,
      alignItems: 'center'
  },
  hostButtonText: {
      ...typography.h3
  }
});

export default HomeScreen;