// Importa as bibliotecas necessárias
import React from 'react';
// Importa o NavigationContainer para gerenciar a navegação
import { NavigationContainer } from '@react-navigation/native';
// Importa a função para criar uma pilha de navegação (stack navigation)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa a StatusBar nativa
import { StatusBar } from 'react-native';

// Importa as telas (screens) do aplicativo
import HomeScreen from './screens/HomeScreen';
import EmergenciaScreen from './screens/EmergenciaScreen';
import AjudaScreen from './screens/AjudaScreen';
// Importa o ThemeProvider para fornecer o contexto de tema (cores, etc.) ao app
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

// Cria uma instância do Stack Navigator
const Stack = createNativeStackNavigator();

// Componente principal do aplicativo
export default function App() {
  return (
    // Envolve todo o app no ThemeProvider para que o tema esteja disponível em qualquer parte
    <ThemeProvider>
      {/* ThemeContext.Consumer nos dá acesso ao tema atual (darkMode) */}
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <>
            {/* Ajuste real da StatusBar no Android */}
            <StatusBar
              barStyle={darkMode ? 'light-content' : 'dark-content'}
              backgroundColor={darkMode ? '#1c1c1e' : '#ffffff'}
              translucent={false}
            />

            {/* NavigationContainer é o componente que gerencia o estado de navegação */}
            <NavigationContainer>
              {/* Stack.Navigator define as rotas do app em forma de pilha */}
              <Stack.Navigator initialRouteName="Home" 
               screenOptions={{ headerShown: false }}>
                {/* Cada Stack.Screen representa uma tela (rota) que pode ser acessada */}
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen}
                />
                <Stack.Screen 
                  name="Emergencia" 
                  component={EmergenciaScreen} 
                />
                <Stack.Screen 
                  name="Ajuda" 
                  component={AjudaScreen} 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
