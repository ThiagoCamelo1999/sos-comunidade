import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './context/locationTask';
import HomeScreen from './screens/HomeScreen';
import EmergenciaScreen from './screens/EmergenciaScreen';
import AjudaScreen from './screens/AjudaScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <>
            <StatusBar
              barStyle={darkMode ? 'light-content' : 'dark-content'}
              backgroundColor={darkMode ? '#1c1c1e' : '#ffffff'}
              translucent={false}
            />
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                  <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Emergencia" component={EmergenciaScreen} />
                    <Stack.Screen name="Ajuda" component={AjudaScreen} />
                  </Stack.Navigator>
                </NavigationContainer>
              </SafeAreaView>
            </SafeAreaProvider>
          </>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
