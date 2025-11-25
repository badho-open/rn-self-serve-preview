import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../theme';

function HomeScreen(): React.JSX.Element {
  return (
    <LinearGradient
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      style={styles.container}>
      <Text style={styles.title}>SELF SERVE PREVIEW DEMO APP</Text>
      <Text style={styles.subtitle}>Welcome!</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.metrics.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes['4xl'],
    fontFamily: theme.typography.fonts.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.metrics.spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default HomeScreen;
