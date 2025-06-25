import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface FriendCardProps {
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'playing';
  score?: number;
  onPress?: () => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({
  name,
  avatar,
  status,
  score,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, styles[status]]} />
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
      {score && (
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{score}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  online: {
    backgroundColor: '#28A745',
  },
  offline: {
    backgroundColor: '#6C757D',
  },
  playing: {
    backgroundColor: '#007AFF',
  },
  status: {
    fontSize: 12,
    color: '#6C757D',
  },
  scoreContainer: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
}); 