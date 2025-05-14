import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../utils/supabaseClient';
import { useTheme } from '../utils/ThemeContext';

export default function EmployerProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error('No active session');
        }
        const userId = session.user.id;
        const { data, error } = await supabase
          .from('users')
          .select('id, email, name, mobile_number, business_name, profile_pic')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setUserData(data);
        setName(data.name || '');
        setMobileNumber(data.mobile_number || '');
        setBusinessName(data.business_name || '');
        if (data.profile_pic) {
          const fileName = data.profile_pic.split('/').pop();
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from('profiles')
            .createSignedUrl(fileName, 60 * 60);
          if (signedUrlError) {
            console.log('Signed URL Error:', signedUrlError.message);
            setProfilePic(null);
          } else {
            setProfilePic(signedUrlData.signedUrl);
          }
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        console.log('Fetch User Error:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      console.log('Requesting media library permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll access is required.');
        return;
      }
      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log('Image picker result:', result);
      if (!result.canceled) {
        const { uri } = result.assets[0];
        console.log('Selected image URI:', uri);
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log('Original file size:', fileInfo.size, 'bytes');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error('No active session');
        }
        const userId = session.user.id;
        const fileName = `profile_${userId}_${Date.now()}.jpg`;
        const fileExt = uri.split('.').pop().toLowerCase();
        const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : fileExt === 'png' ? 'image/png' : 'image/jpeg';
        console.log('Uploading to Supabase with MIME type:', mimeType);
        const uploadResponse = await FileSystem.uploadAsync(
          `https://hceoednqxvubealrjhkf.supabase.co/storage/v1/object/profiles/${fileName}`,
          uri,
          {
            headers: {
              'Content-Type': mimeType,
              'Authorization': `Bearer ${session.access_token}`,
            },
            httpMethod: 'PUT',
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          }
        );
        if (uploadResponse.status !== 200) {
          console.log('Upload Error:', uploadResponse.body);
          throw new Error(`Upload failed: ${uploadResponse.body}`);
        }
        console.log('Upload successful, response:', uploadResponse.body);
        console.log('Generating signed URL...');
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('profiles')
          .createSignedUrl(fileName, 60 * 60);
        if (signedUrlError) {
          console.log('Signed URL Error:', signedUrlError.message);
          throw new Error('Failed to generate signed URL');
        }
        console.log('Signed URL:', signedUrlData.signedUrl);
        setProfilePic(signedUrlData.signedUrl);
        console.log('Saving profile pic to users table...');
        const { error: updateError } = await supabase
          .from('users')
          .update({ profile_pic: `profiles/${fileName}` })
          .eq('id', userId);
        if (updateError) {
          console.log('Update Error:', updateError.message);
          throw new Error(`Failed to save profile picture: ${updateError.message}`);
        }
        console.log('Profile pic saved to users table.');
      } else {
        console.log('Image selection canceled.');
      }
    } catch (error) {
      console.log('Image Pick Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const handleSave = async () => {
    if (!name || !mobileNumber) {
      Alert.alert('Error', 'Name and mobile number are required.');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session.user.id;
      const { error } = await supabase
        .from('users')
        .update({ name, mobile_number: mobileNumber, business_name: businessName })
        .eq('id', userId);
      if (error) throw error;
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log('Save Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.navigate('Welcome');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={[styles.title, { color: '#d1d5db' }]}>Employer Profile</Text>
      {userData ? (
        <>
          <Text style={[styles.label, { color: '#d1d5db' }]}>Email: {userData.email}</Text>
          <View style={styles.profilePicContainer}>
            {profilePic ? (
              <Image
                source={{ uri: profilePic }}
                style={styles.profilePic}
                onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
              />
            ) : (
              <View style={[styles.profilePic, styles.placeholder]} />
            )}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={loading}>
              <Text style={styles.uploadText}>
                {profilePic ? 'Change Profile Picture' : 'Upload Profile Picture'}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { borderColor: theme.accent, color: '#d1d5db' }]}
            placeholder="Name (required)"
            placeholderTextColor="#d1d5db80"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.accent, color: '#d1d5db' }]}
            placeholder="Mobile Number (required)"
            placeholderTextColor="#d1d5db80"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { borderColor: theme.accent, color: '#d1d5db' }]}
            placeholder="Business Name (optional)"
            placeholderTextColor="#d1d5db80"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <View style={styles.buttonContainer}>
            <Button title="Save Profile" onPress={handleSave} color={theme.button} disabled={loading} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Logout" onPress={handleLogout} color={theme.accent} />
          </View>
        </>
      ) : (
        <Text style={{ color: '#d1d5db' }}>Error loading user data</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  scrollContent: { paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  profilePicContainer: { alignItems: 'center', marginVertical: 10 },
  profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  placeholder: { backgroundColor: '#e0e0e0' },
  uploadButton: { padding: 10, backgroundColor: '#ccc', borderRadius: 5 },
  uploadText: { color: '#000', textAlign: 'center' },
  buttonContainer: { marginVertical: 8 },
});