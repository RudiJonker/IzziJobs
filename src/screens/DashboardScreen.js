import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabaseClient';

export default function DashboardScreen() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setEmail(session.user.email);
          console.log('DashboardScreen rendered with email:', session.user.email);
        } else {
          console.log('No session found in DashboardScreen');
        }
      } catch (error) {
        console.log('Error fetching session in DashboardScreen:', error.message);
      }
    };
    fetchSession();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {email || 'User'}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#333' },
  title: { fontSize: 24, color: '#fff', textAlign: 'center' },
});