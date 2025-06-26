import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { colors, spacing, typography } from '../../theme/theme';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import { Ionicons } from '@expo/vector-icons';

const GuestJoinScreen = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const [nickname, setNickname] = useState('');
    const { startGuestSession } = useAuth();
    const { joinGame } = useGame();

    const handleJoin = () => {
        if (pin.trim().length > 0 && nickname.trim().length > 0) {
            const finalPin = pin.trim();
            const finalNickname = nickname.trim();

            // 1. Start a temporary guest session in the AuthContext.
            startGuestSession(finalNickname);
            
            // 2. Call the joinGame function from GameContext.
            joinGame(finalPin);
            
            // 3. Navigate to the lobby.
            navigation.navigate('GameLobby', { pin: finalPin, isHost: false });

        } else {
            alert('Please enter a nickname and a Game PIN.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.title}>Join as Guest</Text>
                <Text style={styles.subtitle}>No account needed! Just enter a nickname and the PIN.</Text>
                
                <AppTextInput
                    placeholder="Enter your nickname..."
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={15}
                    style={styles.input}
                />
                <AppTextInput
                    placeholder="Game PIN"
                    value={pin}
                    onChangeText={setPin}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.pinInput}
                />
                <AppButton title="Let's Go!" onPress={handleJoin} />
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
    input: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    pinInput: {
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 8,
        fontWeight: 'bold'
    },
});

export default GuestJoinScreen;