import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../utils/supabaseClient';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker');

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Error', 'Email already registered');
    } else {
      await supabase.from('users').insert([{ id: data.user.id, email, role }]);
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IzziJobs Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.roleContainer}>
        <Button
          title="Job Seeker"
          onPress={() => setRole('job_seeker')}
          color={role === 'job_seeker' ? '#48d22b' : '#666'}
        />
        <Button
          title="Employer"
          onPress={() => setRole('employer')}
          color={role === 'employer' ? '#48d22b' : '#666'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} color="#48d22b" />
      </View>
      <Button title="Login" onPress={() => navigation.navigate('Login')} color="#48d22b" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#333' },
  title: { fontSize: 24, color: '#fff', textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 5 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  buttonContainer: { marginBottom: 10 }, // Added margin below Sign Up button
});