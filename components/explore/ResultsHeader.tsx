import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

interface ResultsHeaderProps {
  count: number;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ count }) => (
  <View style={styles.resultsHeader}>
    <Text style={styles.resultsText}>
      {count} term{count !== 1 ? 's' : ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  resultsHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.borderLight,
  },
  resultsText: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
  },
});

export default ResultsHeader;
