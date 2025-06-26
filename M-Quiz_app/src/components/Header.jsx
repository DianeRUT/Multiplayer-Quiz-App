import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

const Header = ({ user }) => {
  return (
    <View style={styles.container}>
        <View style={styles.userInfo}>
            <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
            <View>
                <Text style={styles.rank}>214ᵗʰ Rank</Text>
                <Text style={styles.points}>{user?.points || 797} pt</Text>
            </View>
        </View>
        <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
                 <Ionicons name="trophy-outline" size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="notifications-outline" size={24} color={colors.white} />
            </TouchableOpacity>
        </View>
    </View>
  );
};

Header.propTypes = {
  user: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.secondary
  },
  rank: {
    ...typography.caption,
  },
  points: {
    ...typography.h3,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: 20
  }
});

export default Header;