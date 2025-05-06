import { TamaguiProvider } from 'tamagui';
import { NavigationContainer } from '@react-navigation/native';
import tamaguiConfig from './tamagui.config';
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TamaguiProvider>
  );
}