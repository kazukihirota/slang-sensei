import { MaterialIcons as Icon } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Collapsible } from '../../components/common/Collapsible';
import Filters from '../../components/explore/Filters';
import ResultsHeader from '../../components/explore/ResultsHeader';
import SearchBar from '../../components/explore/SearchBar';
import TermCard from '../../components/explore/TermCard';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { slangTerms } from '../../data/slangTerms';
import {
  DifficultyLevel,
  FormalityLevel,
  Situation,
  SlangTerm,
} from '../../types';

export default function BrowseScreen() {
  const [filteredTerms, setFilteredTerms] = useState<SlangTerm[]>(slangTerms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(
    null
  );
  const [selectedFormality, setSelectedFormality] =
    useState<FormalityLevel | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel | null>(null);
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterTerms = useCallback(() => {
    let filtered = slangTerms;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.reading.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Situation filter
    if (selectedSituation) {
      filtered = filtered.filter(
        (term) => term.situation === selectedSituation
      );
    }

    // Formality filter
    if (selectedFormality) {
      filtered = filtered.filter(
        (term) => term.formalityLevel === selectedFormality
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(
        (term) => term.difficulty === selectedDifficulty
      );
    }

    // Trending filter
    if (showTrendingOnly) {
      filtered = filtered.filter((term) => term.isTrend);
    }

    // If no filters and no search, show nothing
    if (
      !searchQuery &&
      !selectedSituation &&
      !selectedFormality &&
      !selectedDifficulty &&
      !showTrendingOnly
    ) {
      setFilteredTerms([]);
    } else {
      setFilteredTerms(filtered);
    }
  }, [
    searchQuery,
    selectedFormality,
    selectedDifficulty,
    showTrendingOnly,
    selectedSituation,
  ]);

  useEffect(() => {
    filterTerms();
  }, [filterTerms]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSituation(null);
    setSelectedFormality(null);
    setSelectedDifficulty(null);
    setShowTrendingOnly(false);
  };

  const getFormalityColor = (level: FormalityLevel) => {
    switch (level) {
      case FormalityLevel.Casual:
        return colors.success;
      case FormalityLevel.Informal:
        return colors.warning;
      case FormalityLevel.VeryCasual:
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const renderTermCard = ({ item }: { item: SlangTerm }) => (
    <TermCard item={item} getFormalityColor={getFormalityColor} />
  );

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          </View>
          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setFiltersOpen((open) => !open)}
            accessibilityLabel='Toggle filters'
          >
            <Icon
              name='filter-list'
              size={28}
              color={filtersOpen ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Collapsible isOpen={filtersOpen}>
          <Filters
            showTrendingOnly={showTrendingOnly}
            setShowTrendingOnly={setShowTrendingOnly}
            selectedFormality={selectedFormality}
            setSelectedFormality={setSelectedFormality}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            clearFilters={clearFilters}
            selectedSituation={selectedSituation}
          />
        </Collapsible>

        <ResultsHeader count={filteredTerms.length} />

        <FlatList
          data={filteredTerms}
          renderItem={renderTermCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
  },
  filterIconButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
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
  resultsHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.borderLight,
  },
  resultsText: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
  },
  listContainer: {
    padding: spacing.md,
  },
  termCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  termInfo: {
    flex: 1,
  },
  termText: {
    fontSize: typography.japanese.fontSize.medium,
    fontWeight: 'bold',
    color: colors.text,
  },
  readingText: {
    fontSize: typography.japanese.fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.card,
  },
  meaningText: {
    fontSize: typography.english.fontSize.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  situationText: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
});
