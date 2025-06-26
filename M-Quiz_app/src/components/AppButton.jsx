import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { colors, spacing, typography } from '../theme/theme';

const AppButton = ({ title, onPress, disabled = false, loading = false, style, textStyle }) => {
  const buttonStyles = [
    styles.button,
    disabled || loading ? styles.disabled : {},
    style,
  ];

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

AppButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: { ...typography.body, fontWeight: 'bold' },
  disabled: { backgroundColor: colors.gray },
});

export default AppButton;