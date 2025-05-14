import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

export default function WelcomeScreen({ navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Welcome to IzziJobs</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Find or offer short-term jobs easily</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('Auth')}
        color={theme.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});