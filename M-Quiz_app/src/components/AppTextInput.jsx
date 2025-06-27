import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme/theme';

const AppTextInput = ({ label, icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        {icon && <Ionicons name={icon} size={20} color={isFocused ? colors.primary : colors.gray} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
};

AppTextInput.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: '#424242', // Darker gray for labels
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Light gray border
    paddingHorizontal: spacing.md,
  },
  inputContainerFocused: {
    borderColor: colors.primary, // Highlight with primary color when focused
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: '#333', // Dark text for readability
    paddingVertical: spacing.md,
    fontSize: 16,
  },
});

export default AppTextInput;