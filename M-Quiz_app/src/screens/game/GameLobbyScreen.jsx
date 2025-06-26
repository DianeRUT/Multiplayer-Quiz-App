import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';

const GameLobbyScreen = () => {
    const route = useRoute();
    const { gameState, startGame } = useGame();
    const { isHost } = route.params;
    const pin = route.params.pin || gameState.pin;

    /**
     * CORRECTED: Defensive access to the players array.
     * We'll default to an empty array `[]` if `gameState.players` is not yet available.
     * This prevents the `.length` error.
     */
    const players = gameState.players || [];

    if (gameState.status !== 'lobby') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.infoText}>Loading Lobby...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Game Lobby</Text>
                <View style={styles.pinContainer}>
                    <Text style={styles.pinLabel}>Share this Game PIN</Text>
                    <Text style={styles.pin}>{pin}</Text>
                </View>

                {/* Using the safe 'players' variable here */}
                <Text style={styles.playerCount}>{players.length} Player(s) Joined</Text>
                <FlatList
                    data={players}  // Using the safe 'players' variable here
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.playerList}
                    renderItem={({item}) => (
                        <View style={styles.playerCard}>
                            <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                            <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
                        </View>
                    )}
                />

                {isHost && (
                    <AppButton
                        title="Start Quiz"
                        onPress={startGame}
                        disabled={players.length < 1} // Using the safe 'players' variable
                    />
                )}
                 {!isHost && (
                    <Text style={styles.infoText}>Waiting for the host to start the game...</Text>
                 )}
            </View>
        </SafeAreaView>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: spacing.md },
    title: { ...typography.h2, textAlign: 'center', marginBottom: spacing.lg },
    pinContainer: { backgroundColor: colors.darkPurple, padding: spacing.md, borderRadius: 12, alignItems: 'center', marginBottom: spacing.lg },
    pinLabel: { ...typography.caption },
    pin: { ...typography.h1, fontSize: 48, letterSpacing: 5 },
    playerCount: { ...typography.h3, textAlign: 'center', marginBottom: spacing.md },
    playerList: { alignItems: 'center' },
    playerCard: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        margin: spacing.sm,
        width: 150,
    },
    avatar: { width: 60, height: 60, borderRadius: 30, marginBottom: spacing.sm },
    playerName: { ...typography.body, fontWeight: 'bold' },
    infoText: { ...typography.body, color: colors.textMuted, marginTop: spacing.lg },
});

export default GameLobbyScreen;