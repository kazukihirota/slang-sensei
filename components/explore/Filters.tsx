import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { DifficultyLevel, FormalityLevel, Situation } from '../../types';

interface FiltersProps {
  showTrendingOnly: boolean;
  setShowTrendingOnly: (val: boolean) => void;
  selectedFormality: FormalityLevel | null;
  setSelectedFormality: (val: FormalityLevel | null) => void;
  selectedDifficulty: DifficultyLevel | null;
  setSelectedDifficulty: (val: DifficultyLevel | null) => void;
  clearFilters: () => void;
  selectedSituation?: Situation | null;
}

const Filters: React.FC<FiltersProps> = ({
  showTrendingOnly,
  setShowTrendingOnly,
  selectedFormality,
  setSelectedFormality,
  selectedDifficulty,
  setSelectedDifficulty,
  clearFilters,
  selectedSituation,
}) => {
  const FORMALITY_LEVELS: FormalityLevel[] = Object.values(FormalityLevel);
  const DIFFICULTY_LEVELS: DifficultyLevel[] = Object.values(DifficultyLevel);

  const renderFilterChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipSelected]}
      onPress={onPress}
      key={label}
    >
      <Text
        style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Trending</Text>
        <TouchableOpacity
          style={[
            styles.trendingButton,
            showTrendingOnly && styles.trendingButtonSelected,
          ]}
          onPress={() => setShowTrendingOnly(!showTrendingOnly)}
        >
          <Icon
            name='trending-up'
            size={16}
            color={showTrendingOnly ? colors.card : colors.primary}
          />
          <Text
            style={[
              styles.trendingButtonText,
              showTrendingOnly && styles.trendingButtonTextSelected,
            ]}
          >
            Trending
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Formality</Text>
        <View style={styles.filterChips}>
          {FORMALITY_LEVELS.map((level) =>
            renderFilterChip(
              level.charAt(0).toUpperCase() + level.slice(1),
              selectedFormality === level,
              () =>
                setSelectedFormality(selectedFormality === level ? null : level)
            )
          )}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Difficulty</Text>
        <View style={styles.filterChips}>
          {DIFFICULTY_LEVELS.map((level) =>
            renderFilterChip(
              level.charAt(0).toUpperCase() + level.slice(1),
              selectedDifficulty === level,
              () =>
                setSelectedDifficulty(
                  selectedDifficulty === level ? null : level
                )
            )
          )}
        </View>
      </View>

      {(selectedSituation ||
        showTrendingOnly ||
        selectedFormality ||
        selectedDifficulty) && (
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Icon name='clear' size={16} color={colors.primary} />
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: typography.english.fontSize.small,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.english.fontSize.small,
    color: colors.text,
  },
  filterChipTextSelected: {
    color: colors.card,
    fontWeight: '600',
  },
  trendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.card,
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  trendingButtonSelected: {
    backgroundColor: colors.primary,
  },
  trendingButtonText: {
    fontSize: typography.english.fontSize.small,
    color: colors.primary,
  },
  trendingButtonTextSelected: {
    color: colors.card,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  clearButtonText: {
    fontSize: typography.english.fontSize.small,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default Filters;
