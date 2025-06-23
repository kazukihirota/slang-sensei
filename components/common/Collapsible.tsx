import { ThemedView } from '@/components/common/ThemedView';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet } from 'react-native';

interface CollapsibleProps extends PropsWithChildren {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Collapsible({
  children,
  isOpen: isOpenProp,
  onToggle,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof isOpenProp === 'boolean';
  const isOpen = isControlled ? isOpenProp : internalOpen;

  // Only render children if open
  return (
    <ThemedView>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 6,
    marginLeft: 0,
  },
});
