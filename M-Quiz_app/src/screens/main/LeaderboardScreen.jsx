import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

// Dummy data, replace with API call
const DUMMY_LEADERS = [
    { id: '1', name: 'Jackson Kim', points: 2875, avatar: '...' },
    { id: '2', name: 'Gloria Baxter', points: 2738, avatar: '...' },
    { id: '3', name: 'Kendal Coleman', points: 2589, avatar: '...' },
    { id: '4', name: 'You', points: 797, avatar: '...' },
    { id: '5', name: 'Kelin Harward', points: 2166, avatar: '...' },
    { id: '6', name: 'James Haydon', points: 2086, avatar: '...' },
];

const LeaderboardScreen = () => {
    
    const renderPodiumItem = (player, rank) => {
        const isFirst = rank === 1;
        return (
            <View style={[styles.podiumItem, isFirst && styles.firstPlaceItem]}>
                <Text style={[styles.podiumRank, isFirst && { color: '#FFD700'}]}>{rank}</Text>
                <Image source={require('../../assets/images/avatar.png')} style={styles.podiumAvatar}/>
                {isFirst && <Ionicons name="trophy" size={24} color="#FFD700" style={styles.crown}/>}
                <Text style={styles.podiumName}>{player.name}</Text>
                <Text style={styles.podiumPoints}>{player.points} pt</Text>
            </View>
        );
    }

    const renderListItem = ({ item, index }) => (
        <View style={[styles.listItem, item.name === 'You' && styles.userListItem]}>
            <Text style={styles.listRank}>{index + 4}</Text>
            <Image source={require('../../assets/images/avatar.png')} style={styles.listAvatar}/>
            <Text style={styles.listName}>{item.name}</Text>
            <Text style={styles.listPoints}>{item.points} pt</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Text style={styles.title}>Leaderboard</Text>
            
            <View style={styles.podiumContainer}>
                {renderPodiumItem(DUMMY_LEADERS[1], 2)}
                {renderPodiumItem(DUMMY_LEADERS[0], 1)}
                {renderPodiumItem(DUMMY_LEADERS[2], 3)}
            </View>

            <FlatList
                data={DUMMY_LEADERS.slice(3)}
                keyExtractor={item => item.id}
                renderItem={renderListItem}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    title: { ...typography.h1, textAlign: 'center', marginVertical: spacing.md },
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        height: 220,
    },
    podiumItem: {
        width: '30%',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: spacing.sm,
        borderRadius: 12,
    },
    firstPlaceItem: {
        width: '33%',
        paddingVertical: spacing.lg,
        backgroundColor: colors.darkPurple,
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    podiumRank: { ...typography.h2, color: colors.textMuted },
    podiumAvatar: { width: 60, height: 60, borderRadius: 30, marginVertical: spacing.sm },
    crown: { position: 'absolute', top: -12, right: 10, transform: [{rotate: '15deg'}] },
    podiumName: { ...typography.body, fontWeight: 'bold', textAlign: 'center' },
    podiumPoints: { ...typography.caption, color: colors.secondary },
    listContainer: { paddingHorizontal: spacing.md },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.card,
        borderRadius: 10,
        marginBottom: spacing.sm,
    },
    userListItem: {
        backgroundColor: colors.primary,
        borderColor: colors.secondary,
        borderWidth: 1,
    },
    listRank: { ...typography.h3, width: 40, color: colors.textMuted },
    listAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: spacing.md },
    listName: { ...typography.body, flex: 1, fontWeight: 'bold' },
    listPoints: { ...typography.body, fontWeight: 'bold', color: colors.textMuted },
});

export default LeaderboardScreen;