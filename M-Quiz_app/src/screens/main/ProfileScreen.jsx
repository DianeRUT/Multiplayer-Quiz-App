import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../components/AppButton';

const ProfileScreen = () => {
    const { user, logout } = useAuth();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileHeader}>
                    <Image source={require('../../assets/images/avatar.png')} style={styles.avatar} />
                    <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.email}>{user?.email || 'guest@quizon.com'}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Quizzes Played</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>82%</Text>
                        <Text style={styles.statLabel}>Win Rate</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>#214</Text>
                        <Text style={styles.statLabel}>Global Rank</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="person-circle-outline" size={24} color={colors.textMuted} />
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={24} color={colors.textMuted} />
                        <Text style={styles.menuText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={24} color={colors.textMuted} />
                        <Text style={styles.menuText}>Help Center</Text>
                        <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>

                <AppButton title="Logout" onPress={logout} style={styles.logoutButton}/>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: { padding: spacing.lg },
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: colors.secondary,
        marginBottom: spacing.md,
    },
    name: { ...typography.h2 },
    email: { ...typography.body, color: colors.textMuted },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.xl,
    },
    statBox: { alignItems: 'center' },
    statValue: { ...typography.h3 },
    statLabel: { ...typography.caption },
    menuContainer: {
        backgroundColor: colors.card,
        borderRadius: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkPurple,
    },
    menuText: {
        ...typography.body,
        flex: 1,
        marginLeft: spacing.md,
    },
    logoutButton: {
        marginTop: spacing.xl,
        backgroundColor: colors.error,
    }
});

export default ProfileScreen;