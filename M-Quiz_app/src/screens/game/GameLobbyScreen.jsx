import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import { Ionicons } from '@expo/vector-icons';

const GameLobbyScreen = ({ navigation, route }) => {
    const { gameState, startGame, resetGame } = useGame();
    const { isHost } = route.params;
    const pin = route.params.pin || gameState.pin;

    // A safe way to access the players array, defaulting to [] to prevent crashes.
    const players = gameState.players || [];

    /**
     * This useEffect is the new "brain" for this screen.
     * It listens for the game status to change. When the host starts the game,
     * status becomes 'in-progress', and this will trigger navigation.
     */
    useEffect(() => {
        if (gameState.status === 'in-progress') {
            // Use replace so the user can't press the back button to return to the lobby.
            navigation.replace('Quiz');
        }
    }, [gameState.status, navigation]);


    // Handler for the back button
    const handleGoBack = () => {
        // We must reset the game state when leaving the lobby
        resetGame();
        navigation.goBack();
    };

    // A fallback UI for edge cases where the component might render before the state is ready.
    if (gameState.status !== 'lobby' || !pin) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.white} />
                    <Text style={styles.infoText}>Joining Lobby...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="close-circle-outline" size={32} color={colors.gray} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>Game Lobby</Text>
                <View style={styles.pinContainer}>
                    <Text style={styles.pinLabel}>Share this Game PIN</Text>
                    <Text style={styles.pin}>{pin}</Text>
                </View>

                <Text style={styles.playerCount}>{players.length} Player(s) Joined</Text>
                <FlatList
                    data={players}
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
                
                <View style={styles.footer}>
                    {isHost && (
                        <AppButton
                            title="Start Quiz"
                            onPress={startGame}
                            disabled={players.length < 1}
                        />
                    )}
                    {!isHost && (
                        <Text style={styles.infoText}>Waiting for the host to start the game...</Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
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
    footer: {
        paddingVertical: spacing.md
    },
    infoText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});

export default GameLobbyScreen;