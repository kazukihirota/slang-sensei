import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { FormalityLevel, SlangTerm } from '../../types';

interface TermCardProps {
  item: SlangTerm;
  getFormalityColor: (level: FormalityLevel) => string;
}

const TermCard: React.FC<TermCardProps> = ({ item, getFormalityColor }) => (
  <TouchableOpacity style={styles.termCard}>
    <View style={styles.termHeader}>
      <View style={styles.termInfo}>
        <Text style={styles.termText}>{item.term}</Text>
        <Text style={styles.readingText}>{item.reading}</Text>
      </View>
      <View style={styles.badges}>
        {item.isTrend && (
          <View style={[styles.badge, styles.trendBadge]}>
            <Icon name='trending-up' size={12} color={colors.card} />
          </View>
        )}
        <View
          style={[
            styles.badge,
            { backgroundColor: getFormalityColor(item.formalityLevel) },
          ]}
        >
          <Text style={styles.badgeText}>
            {item.formalityLevel.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
    <Text style={styles.meaningText}>{item.meaning}</Text>
    <Text style={styles.situationText}>
      {item.situation.replace(/_/g, ' ')}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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

export default TermCard;
