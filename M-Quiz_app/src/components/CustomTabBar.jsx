import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../theme/theme';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        // A beautiful gradient from our primary color to a slightly lighter variant
        colors={[colors.primary, '#8A56E3']}
        style={styles.tabBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          // Check if the current tab is the focused one
          const isFocused = state.index === index;

          // Function to handle press events
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Determine the icon name based on the route name
          let iconName;
          if (route.name === 'HomeTab') iconName = isFocused ? 'home' : 'home-outline';
          else if (route.name === 'LeaderboardTab') iconName = isFocused ? 'trophy' : 'trophy-outline';
          else if (route.name === 'ProfileTab') iconName = isFocused ? 'person' : 'person-outline';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <Ionicons 
                name={iconName} 
                size={26} 
                color={isFocused ? colors.secondary : colors.lightGray} 
              />
              {/* Optional: Add a small dot for the focused tab */}
              {isFocused && <View style={styles.focusDot} />}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        elevation: 5, // for Android shadow
        shadowColor: colors.primary, // for iOS shadow
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
    },
    tabBar: {
        flexDirection: 'row',
        height: 65,
        borderRadius: 25,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    focusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.secondary,
        marginTop: 4,
    }
});

export default CustomTabBar;