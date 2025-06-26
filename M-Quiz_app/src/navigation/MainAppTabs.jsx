import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// We no longer need useGame or useNavigation here.

// Import all screens
import HomeScreen from '../screens/main/HomeScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import MyQuizzesScreen from '../screens/creator/MyQuizzesScreen';
import CreateQuizScreen from '../screens/creator/CreateQuizScreen';
import JoinGameScreen from '../screens/game/JoinGameScreen';
import GameLobbyScreen from '../screens/game/GameLobbyScreen';
import QuizScreen from '../screens/game/QuizScreen';
import ResultsScreen from '../screens/game/ResultsScreen';

import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// This component has NO CHANGES.
const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'LeaderboardTab') iconName = focused ? 'trophy' : 'trophy-outline';
            else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
            backgroundColor: colors.darkPurple, borderTopColor: colors.darkPurple, height: 90, paddingBottom: 30,
        },
        tabBarShowLabel: false,
        })}
    >
        <Tab.Screen name="HomeTab" component={HomeScreen} />
        <Tab.Screen name="LeaderboardTab" component={LeaderboardScreen} />
        <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
);

// This component is now simplified. The handler is gone.
const MainAppTabs = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="MyQuizzes" component={MyQuizzesScreen} />
        <Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
        <Stack.Screen name="JoinGame" component={JoinGameScreen} />
        <Stack.Screen name="GameLobby" component={GameLobbyScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="Results" component={ResultsScreen} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
);

export default MainAppTabs;