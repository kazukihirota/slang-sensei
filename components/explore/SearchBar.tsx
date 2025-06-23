import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear }) => (
  <View style={styles.searchBar}>
    <Icon name='search' size={20} color={colors.textSecondary} />
    <TextInput
      style={styles.searchInput}
      placeholder='Search slang terms...'
      value={value}
      onChangeText={onChange}
      placeholderTextColor={colors.textMuted}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={onClear}>
        <Icon name='clear' size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.english.fontSize.medium,
    color: colors.text,
  },
});

export default SearchBar;
