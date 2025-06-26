import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';

const ResultsScreen = () => {
    const navigation = useNavigation();
    const { gameState, resetGame } = useGame();
    const { user } = useAuth(); // We need the user to check their role
    const { results } = gameState;

    if (!results || results.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <ActivityIndicator color={colors.white} size="large" />
                    <Text style={styles.title}>Calculating results...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const myRank = user ? results.findIndex(p => p.id === user.id) + 1 : -1;
    const isWinner = myRank === 1;

    /**
     * CORRECTED: This function now handles both guest and logged-in users.
     */
    const handleFinishGame = () => {
        // First, always reset the global game state.
        resetGame();

        // If the user is a guest, they are in the GuestStack.
        // popToTop() will send them back to the first screen in that stack (GuestJoinScreen).
        if (user?.role === 'GUEST') {
            navigation.popToTop();
        }
        // For logged-in users, the onStateChange listener in AppNavigator
        // will automatically navigate them back to the main tabs.
    };

    const renderPlayer = ({ item, index }) => (
        <View style={styles.playerRow}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar}/>
            <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.score}>{item.score} pts</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.summaryCard}>
                    {isWinner ? (
                        <>
                         <Ionicons name="trophy" size={80} color="#FFD700" />
                         <Text style={styles.congratsText}>Congratulations!</Text>
                         <Text style={styles.rankText}>You finished in 1st Place!</Text>
                        </>
                    ) : (
                        <>
                          <Ionicons name="ribbon-outline" size={80} color={colors.textMuted} />
                          <Text style={styles.congratsText}>Good Game!</Text>
                          {myRank > 0 ? (
                            <Text style={styles.rankText}>You finished in {myRank} place.</Text>
                          ) : (
                            <Text style={styles.rankText}>You played well!</Text>
                          )}
                        </>
                    )}
                </View>

                <Text style={styles.standingsHeader}>Final Standings</Text>
                <FlatList
                    data={results}
                    renderItem={renderPlayer}
                    keyExtractor={item => item.id.toString()}
                    style={styles.list}
                />

                <AppButton title="Finish" onPress={handleFinishGame} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: spacing.md },
    title: { ...typography.h2 },
    summaryCard: {
        backgroundColor: colors.darkPurple,
        borderRadius: 16,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    congratsText: { ...typography.h1, marginTop: spacing.md, textAlign: 'center' },
    rankText: { ...typography.body, color: colors.textMuted, marginTop: spacing.sm },
    standingsHeader: { ...typography.h2, marginBottom: spacing.md },
    list: { flex: 1 },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 10,
        marginBottom: spacing.sm,
    },
    rank: { ...typography.h3, color: colors.textMuted, width: 40 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: spacing.md },
    playerName: { ...typography.body, flex: 1, fontWeight: 'bold' },
    score: { ...typography.body, color: colors.secondary, fontWeight: 'bold' },
});

export default ResultsScreen;