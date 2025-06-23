import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { SlangTerm } from '../../types';

interface FlashCardFrontProps {
  term: SlangTerm;
  onSpeakerPress: () => void;
}

const FlashCardFront: React.FC<FlashCardFrontProps> = ({
  term,
  onSpeakerPress,
}) => (
  <>
    <View style={styles.termRow}>
      <Text style={styles.term}>{term.term}</Text>
      <TouchableOpacity
        style={styles.speakerButton}
        onPress={onSpeakerPress}
        accessibilityLabel='Play pronunciation'
      >
        <Icon name='volume-up' size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
    <Text style={styles.reading}>{term.reading}</Text>
    <View style={styles.tapHint}>
      <Icon name='touch-app' size={24} color={colors.textMuted} />
      <Text style={styles.hintText}>Tap to reveal meaning</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  term: {
    fontSize: typography.japanese.fontSize.large,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  reading: {
    fontSize: typography.japanese.fontSize.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tapHint: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  hintText: {
    fontSize: typography.english.fontSize.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  speakerButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
});

export default FlashCardFront;
