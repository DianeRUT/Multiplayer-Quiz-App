import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from '../../components';

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Battle</Text>
        <Text style={styles.subtitle}>Ready to challenge?</Text>
      </View>

      <View style={styles.actions}>
        <Button 
          title="Quick Match" 
          onPress={() => {}} 
          variant="primary"
        />
        <Button 
          title="Private Room" 
          onPress={() => {}} 
          variant="outline"
        />
        <Button 
          title="Tournament" 
          onPress={() => {}} 
          variant="secondary"
        />
      </View>

      <View style={styles.stats}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Games Played:</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Win Rate:</Text>
          <Text style={styles.statValue}>0%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Points:</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  stats: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#6C757D',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
}); 