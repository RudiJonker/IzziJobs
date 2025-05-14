import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';
import { useTheme } from '../utils/ThemeContext';

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('job_seeker');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignup) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const userId = data.user.id;
        console.log('Signup User ID:', userId);

        // Set session manually
        if (data.session) {
          const { error: sessionError } = await supabase.auth.setSession(data.session);
          if (sessionError) console.log('Set session error:', sessionError.message);
        } else {
          console.log('No session returned from signUp');
        }

        // Insert into users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({ id: userId, email, name, role });
        if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

        Alert.alert('Success', 'Account created! Please log in.');
        setIsSignup(false);
      } else {
        // Log in
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const userId = data.user.id;
        console.log('Login User ID:', userId);

        // Check session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
          throw new Error('No active session after login');
        }
        console.log('Session UID:', sessionData.session.user.id);

        // Fetch user role
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId);
        if (fetchError) throw new Error(`Fetch error: ${fetchError.message}`);
        if (!userData || userData.length === 0) {
          throw new Error('No user data found. Please sign up again.');
        }
        if (userData.length > 1) {
          throw new Error('Multiple user records found. Contact support.');
        }
        const userRole = userData[0].role;
        navigation.navigate(userRole === 'job_seeker' ? 'JobSeekerProfile' : 'EmployerProfile');
      }
    } catch (error) {
      console.log('Auth Error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: 'Select Role', value: null },
    { label: 'Job Seeker', value: 'job_seeker' },
    { label: 'Employer', value: 'employer' },
  ];

  const selectedLabel = roleOptions.find((option) => option.value === role)?.label || 'Select Role';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: '#d1d5db' }]}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
      {isSignup && (
        <>
          <TextInput
            style={[styles.input, { borderColor: theme.accent, color: '#d1d5db' }]}
            placeholder="Name"
            placeholderTextColor="#d1d5db80"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={[styles.pickerContainer, { borderColor: theme.accent, backgroundColor: '#ffffff' }]}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.pickerRow}>
              <Text style={[styles.pickerText, { color: '#000000' }]}>{selectedLabel}</Text>
              <Ionicons name="chevron-down" size={20} color="#000000" />
            </View>
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: '#ffffff' }]}>
                {roleOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value || 'null'}
                    style={styles.modalItem}
                    onPress={() => {
                      setRole(option.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { color: '#000000' }]}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </>
      )}
      <TextInput
        style={[styles.input, { borderColor: theme.accent, color: '#d1d5db' }]}
        placeholder="Email"
        placeholderTextColor="#d1d5db80"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.accent, color: '#d1d5db' }]}
        placeholder="Password"
        placeholderTextColor="#d1d5db80"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
        onPress={handleAuth}
        disabled={loading}
        color={theme.button}
      />
      <Button
        title={`Switch to ${isSignup ? 'Log In' : 'Sign Up'}`}
        onPress={() => setIsSignup(!isSignup)}
        color={theme.accent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  pickerContainer: {
    borderWidth: 1,
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  modalItem: {
    padding: 15,
  },
  modalItemText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
});