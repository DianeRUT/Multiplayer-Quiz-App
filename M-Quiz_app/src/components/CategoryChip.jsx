import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

const ICONS = {
    "space": "rocket-outline",
    "sports": "football-outline",
    "history": "shield-outline",
    "maths": "calculator-outline",
    "random quiz": "shuffle-outline"
};

const CategoryChip = ({ title, onPress }) => {
  const iconName = ICONS[title.toLowerCase()] || 'help-circle-outline';

  return (
    <TouchableOpacity onPress={onPress} style={styles.chip}>
      <Ionicons name={iconName} size={24} color={colors.white} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

CategoryChip.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.cardLight,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: spacing.sm,
    minHeight: 100,
  },
  text: {
    ...typography.body,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
});

export default CategoryChip;