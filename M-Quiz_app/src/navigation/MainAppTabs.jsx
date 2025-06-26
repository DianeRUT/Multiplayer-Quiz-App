import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import CustomTabBar from '../components/CustomTabBar'; // <-- IMPORT THE NEW COMPONENT

// Import all screens (no changes here)
// import HomeScreen from '../screens/main/HomeScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CategoryQuizListScreen from '../screens/main/CategoryQuizListScreen';
import QuizDetailScreen from '../screens/main/QuizDetailScreen';
import MyQuizzesScreen from '../screens/creator/MyQuizzesScreen';
import CreateQuizScreen from '../screens/creator/CreateQuizScreen';
import JoinGameScreen from '../screens/game/JoinGameScreen';
import GameLobbyScreen from '../screens/game/GameLobbyScreen';
import QuizScreen from '../screens/game/QuizScreen';
import ResultsScreen from '../screens/game/ResultsScreen';
import HomeScreen from '../screens/main/HomeScreen';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/**
 * UPDATED: This component now uses a custom component for its tab bar,
 * giving us full control over its appearance.
 */
const BottomTabNavigator = () => (
    <Tab.Navigator
        // Use the tabBar prop to provide our custom component
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{
            headerShown: false,
        }}
    >
        <Tab.Screen name="HomeTab" component={HomeScreen} />
       
        <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
);

const MainAppTabs = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        
        {/* All other screens in the stack remain the same */}
        <Stack.Screen name="CategoryQuizList" component={CategoryQuizListScreen} />
        <Stack.Screen name="QuizDetail" component={QuizDetailScreen} />
        <Stack.Screen name="MyQuizzes" component={MyQuizzesScreen} />
        <Stack.Screen name="CreateQuiz" component={CreateQuizScreen} />
        <Stack.Screen name="JoinGame" component={JoinGameScreen} />
        <Stack.Screen name="GameLobby" component={GameLobbyScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ gestureEnabled: false }}/>
        <Stack.Screen name="Results" component={ResultsScreen} options={{ gestureEnabled: false }}/>
    </Stack.Navigator>
);

export default MainAppTabs;