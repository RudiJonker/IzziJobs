import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { supabase } from '../utils/supabaseClient';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [showWelcome, setShowWelcome] = useState(false);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert(
        'Error',
        'Please sign up first',
        [{ text: 'Back', onPress: () => {} }],
        { cancelable: false }
      );
    } else {
      navigation.navigate('Dashboard');
    }
  };

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Error', 'Email already registered');
    } else {
      await supabase.from('users').insert([{ id: data.user.id, email, role }]);
      setShowWelcome(true);
      setTimeout(() => {
        setShowWelcome(false);
        navigation.navigate('Dashboard');
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={showWelcome} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Welcome, {email}!</Text>
        </View>
      </Modal>
      <Text style={styles.title}>IzziJobs</Text>
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
        <TouchableOpacity
          style={[styles.roleButton, role === 'job_seeker' ? styles.roleButtonActive : {}]}
          onPress={() => setRole('job_seeker')}
        >
          <Text style={styles.roleButtonText}>Job Seeker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'employer' ? styles.roleButtonActive : {}]}
          onPress={() => setRole('employer')}
        >
          <Text style={styles.roleButtonText}>Employer</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 20, // Match LoginScreen
    borderRadius: 5,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#666',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: '#48d22b',
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#48d22b',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Match your preferred spacing
  },
  loginButton: {
    backgroundColor: '#48d22b',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Match your preferred spacing
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 24,
    color: '#fff',
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
  },
});