// Importa o React para usar JSX e componentes
import React from 'react';
// Importa o container de navegação principal do React Navigation
import { NavigationContainer } from '@react-navigation/native';
// Importa o criador de pilha de navegação nativa
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa o componente para controlar a barra de status do dispositivo
import { StatusBar } from 'react-native';
// Importa o provedor e contexto de tema personalizado
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
// Importa provedores para lidar com áreas seguras em dispositivos (notch, etc)
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// Importa um arquivo que provavelmente inicializa tarefas de localização
import './context/locationTask';
// Importa as telas principais do app
import HomeScreen from './screens/HomeScreen';
import EmergenciaScreen from './screens/EmergenciaScreen';
import AjudaScreen from './screens/AjudaScreen';

// Cria o objeto de navegação em pilha
const Stack = createNativeStackNavigator();

// Componente principal do app
export default function App() {
  return (
    // Provedor de tema para disponibilizar o tema (claro/escuro) para toda a árvore de componentes
    <ThemeProvider>
      {/* Consumidor do contexto de tema para acessar se está em darkMode */}
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <>
            {/* Configura a barra de status conforme o tema */}
            <StatusBar
              barStyle={darkMode ? 'light-content' : 'dark-content'}
              backgroundColor={darkMode ? '#1c1c1e' : '#ffffff'}
              translucent={false}
            />
            {/* Provedor de área segura para lidar com áreas não utilizáveis da tela */}
            <SafeAreaProvider>
              {/* Garante que o conteúdo fique dentro da área segura */}
              <SafeAreaView style={{ flex: 1 }}>
                {/* Container de navegação para gerenciar as rotas */}
                <NavigationContainer>
                  {/* Define a pilha de navegação e as telas disponíveis */}
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