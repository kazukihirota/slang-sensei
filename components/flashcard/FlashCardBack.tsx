import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { SlangTerm } from '../../types';

interface FlashCardBackProps {
  term: SlangTerm;
  showExample: boolean;
  onToggleExample: () => void;
  flipAnimation: Animated.Value;
}

const FlashCardBack: React.FC<FlashCardBackProps> = ({
  term,
  showExample,
  onToggleExample,
  flipAnimation,
}) => (
  <>
    <Animated.View
      style={[
        styles.meaningContainer,
        {
          opacity: flipAnimation,
          transform: [
            {
              translateY: flipAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.meaning}>{term.meaning}</Text>
      <Text style={styles.situation}>{term.situation.replace(/_/g, ' ')}</Text>
    </Animated.View>
    <TouchableOpacity style={styles.exampleButton} onPress={onToggleExample}>
      <Icon
        name={showExample ? 'expand-less' : 'expand-more'}
        size={24}
        color={colors.primary}
      />
      <Text style={styles.exampleButtonText}>
        {showExample ? 'Hide' : 'Show'} Example
      </Text>
    </TouchableOpacity>
  </>
);

const styles = StyleSheet.create({
  meaningContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  meaning: {
    fontSize: typography.english.fontSize.large,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  situation: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  exampleButtonText: {
    fontSize: typography.english.fontSize.medium,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default FlashCardBack;
