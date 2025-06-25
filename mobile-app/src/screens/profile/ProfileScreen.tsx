import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }} 
          style={styles.avatar}
        />
        <Text style={styles.name}>Player Name</Text>
        <Text style={styles.email}>player@example.com</Text>
      </View>
      
      <View style={styles.stats}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Games Played</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statValue}>0%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Points</Text>
          <Text style={styles.statValue}>0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6C757D',
  },
  stats: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statItem: {
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
  },
}); 