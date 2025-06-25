import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FriendCard } from '../../components';

export const FriendsScreen: React.FC = () => {
  const mockFriends = [
    { id: '1', name: 'John Doe', avatar: 'https://via.placeholder.com/50', status: 'online' as const, score: 1250 },
    { id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/50', status: 'playing' as const, score: 980 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={mockFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendCard
            name={item.name}
            avatar={item.avatar}
            status={item.status}
            score={item.score}
          />
        )}
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
    marginBottom: 20,
  },
}); 