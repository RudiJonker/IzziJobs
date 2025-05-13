import React from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import { createStackNavigator } from '@react-navigation/stack';
   import { ThemeProvider } from './src/utils/ThemeContext';
   import WelcomeScreen from './src/screens/WelcomeScreen';
   import AuthScreen from './src/screens/AuthScreen';
   import JobSeekerProfileScreen from './src/screens/JobSeekerProfileScreen';
   import EmployerProfileScreen from './src/screens/EmployerProfileScreen';
   import DashboardScreen from './src/screens/DashboardScreen';
   import SettingsScreen from './src/screens/SettingsScreen';

   const Stack = createStackNavigator();

   export default function App() {
     return (
       <ThemeProvider>
         <NavigationContainer>
           <Stack.Navigator
             initialRouteName="Welcome"
             screenOptions={{
               headerShown: false,
               cardStyleInterpolator: ({ current }) => ({
                 cardStyle: { opacity: current.progress },
               }),
             }}
           >
             <Stack.Screen name="Welcome" component={WelcomeScreen} />
             <Stack.Screen name="Auth" component={AuthScreen} />
             <Stack.Screen name="JobSeekerProfile" component={JobSeekerProfileScreen} />
             <Stack.Screen name="EmployerProfile" component={EmployerProfileScreen} />
             <Stack.Screen name="Dashboard" component={DashboardScreen} />
             <Stack.Screen name="Settings" component={SettingsScreen} />
           </Stack.Navigator>
         </NavigationContainer>
       </ThemeProvider>
     );
   }