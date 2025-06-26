import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { Ionicons } from '@expo/vector-icons';

const JoinGameScreen = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const { joinGame } = useGame();

    const handleJoin = () => {
        if (pin.trim().length > 0) {
            const finalPin = pin.trim();
            // Step 1: Call the context function. This sets state and emits the socket event.
            joinGame(finalPin);
            // Step 2: Manually navigate to the lobby. The context no longer does this.
            navigation.navigate('GameLobby', { pin: finalPin, isHost: false });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.title}>Join a Game</Text>
                <Text style={styles.subtitle}>Enter the Game PIN provided by the host.</Text>
                <AppTextInput
                    placeholder="Game PIN"
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.pinInput}
                />
                <AppButton title="Join Game" onPress={handleJoin} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, justifyContent: 'center', padding: spacing.lg },
    backButton: { position: 'absolute', top: 60, left: spacing.lg, zIndex: 1 },
    title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.sm },
    subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
    pinInput: {
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 8,
        fontWeight: 'bold'
    },
});

export default JoinGameScreen;