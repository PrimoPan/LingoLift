import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

const HIDDEN_ROUTES = new Set(['Opening', 'HorizontalLayout', 'Draft']);

const GlobalBrandMark = () => {
  const routeName = useNavigationState((state) => {
    if (!state || state.index == null || !state.routes?.length) {
      return '';
    }
    return state.routes[state.index]?.name || '';
  });

  if (!routeName || HIDDEN_ROUTES.has(routeName)) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.text}>LingoLift</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    backgroundColor: '#FFCB3A',
    marginRight: 8,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: '#39B8FF',
  },
});

export default GlobalBrandMark;
