import { MaterialIcons as Icon } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { SlangTerm } from '../../types';
import FlashCardBack from './FlashCardBack';
import FlashCardFront from './FlashCardFront';
import FlashCardHeaderBadges from './FlashCardHeaderBadges';

interface FlashCardProps {
  term: SlangTerm;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export default function FlashCard({
  term,
  onNext,
  onPrevious,
  showNavigation = false,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;
    if (toValue === 1) {
      setIsFlipped(true);
    }
    Animated.timing(flipAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 0) {
        setIsFlipped(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={handleFlip}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <FlashCardHeaderBadges term={term} />
        </View>

        <View style={styles.cardContent}>
          {!isFlipped ? (
            <FlashCardFront
              term={term}
              onSpeakerPress={() =>
                Speech.speak(term.term, { language: 'ja-JP' })
              }
            />
          ) : (
            <FlashCardBack
              term={term}
              showExample={showExample}
              onToggleExample={() => setShowExample(!showExample)}
              flipAnimation={flipAnimation}
            />
          )}
        </View>
      </TouchableOpacity>

      {showExample && isFlipped && (
        <Animated.View style={styles.exampleContainer}>
          <Text style={styles.exampleJapanese}>{term.exampleSentenceJap}</Text>
          <Text style={styles.exampleEnglish}>{term.exampleSentenceEng}</Text>
        </Animated.View>
      )}

      {showNavigation && (
        <View style={styles.navigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={onPrevious}
            disabled={!onPrevious}
          >
            <Icon
              name='chevron-left'
              size={24}
              color={onPrevious ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.navText,
                { color: onPrevious ? colors.primary : colors.textMuted },
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={onNext}
            disabled={!onNext}
          >
            <Text
              style={[
                styles.navText,
                { color: onNext ? colors.primary : colors.textMuted },
              ]}
            >
              Next
            </Text>
            <Icon
              name='chevron-right'
              size={24}
              color={onNext ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: spacing.lg,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exampleContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  exampleJapanese: {
    fontSize: typography.japanese.fontSize.medium,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  exampleEnglish: {
    fontSize: typography.english.fontSize.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  navText: {
    fontSize: typography.english.fontSize.medium,
    fontWeight: '500',
  },
  speakerButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
});
