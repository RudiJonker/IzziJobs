import React from 'react';
   import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
   import { useTheme } from '../utils/ThemeContext';

   export default function WelcomeScreen({ navigation }) {
     const { theme } = useTheme();

     return (
       <View style={[styles.container, { backgroundColor: theme.background }]}>
         <Text style={[styles.title, { color: theme.text }]}>Welcome to IzziJobs</Text>
         <Text style={[styles.subtitle, { color: theme.text }]}>
           Connecting job seekers and employers in South Africa
         </Text>
         <TouchableOpacity
           style={[styles.button, { backgroundColor: theme.button }]}
           onPress={() => navigation.navigate('Auth')}
         >
           <Text style={styles.buttonText}>Get Started</Text>
         </TouchableOpacity>
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       padding: 20,
     },
     title: {
       fontSize: 32,
       fontWeight: 'bold',
       marginBottom: 10,
     },
     subtitle: {
       fontSize: 18,
       marginBottom: 30,
     },
     button: {
       paddingVertical: 15,
       paddingHorizontal: 40,
       borderRadius: 10,
     },
     buttonText: {
       color: '#fff',
       fontSize: 18,
       fontWeight: 'bold',
     },
   });