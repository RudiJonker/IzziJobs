import { useState } from 'react';
import { Button, Input, Stack, Text, YStack } from 'tamagui';
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
  };

  return (
    <YStack flex={1} justifyContent="center" padding="$4" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$4" textAlign="center">
        Join IzziJobs
      </Text>
      <Stack space="$3">
        <Input
          size="$5"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          size="$5"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button size="$5" backgroundColor="$green8" onPress={handleSignUp}>
          Sign Up
        </Button>
        <Button
          size="$5"
          variant="outlined"
          onPress={() => navigation.navigate('Login')}
        >
          Back to Login
        </Button>
      </Stack>
    </YStack>
  );
}