import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

const QuizCard = ({ title, icon, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={32} color={colors.white} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

QuizCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
    minHeight: 120,
  },
  title: {
    ...typography.body,
    marginTop: spacing.sm,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QuizCard;