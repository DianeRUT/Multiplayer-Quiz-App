import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/theme';

const AppTextInput = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={colors.gray}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    ...typography.body,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    color: colors.white,
  },
});

export default AppTextInput;