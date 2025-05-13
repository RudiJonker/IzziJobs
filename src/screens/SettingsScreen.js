import React from 'react';
     import { View, Text, StyleSheet } from 'react-native';
     import { useTheme } from '../utils/ThemeContext';

     export default function SettingsScreen() {
       const { theme } = useTheme();
       return (
         <View style={[styles.container, { backgroundColor: theme.background }]}>
           <Text style={[styles.text, { color: theme.text }]}>Placeholder: Settings Screen</Text>
         </View>
       );
     }

     const styles = StyleSheet.create({
       container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
       text: { fontSize: 20 },
     });