// context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria o contexto do tema para ser usado em toda a aplicação
export const ThemeContext = createContext();

// Provedor do tema, envolve a aplicação e fornece o contexto
export const ThemeProvider = ({ children }) => {
  // Estado para controlar se o modo escuro está ativado
  const [darkMode, setDarkMode] = useState(false);
  // Estado para controlar se o tema segue automaticamente o sistema
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    // Carrega as preferências salvas do AsyncStorage ao iniciar
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme'); // 'dark' ou 'light'
      const savedIsAuto = await AsyncStorage.getItem('isAuto'); // 'true' ou 'false'
      
      if (savedIsAuto !== null) {
        setIsAuto(savedIsAuto === 'true'); // Define se está no modo automático
      }
      
      if (savedTheme !== null && savedIsAuto === 'false') {
        setDarkMode(savedTheme === 'dark'); // Usa o tema salvo manualmente
      } else if (savedIsAuto === 'true') {
        const systemTheme = Appearance.getColorScheme(); // Obtém o tema do sistema
        setDarkMode(systemTheme === 'dark'); // Define o tema conforme o sistema
      }
    })();

    // Adiciona um listener para mudanças no tema do sistema operacional
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isAuto) {
        setDarkMode(colorScheme === 'dark'); // Atualiza o tema se estiver no modo automático
      }
    });

    // Remove o listener ao desmontar o componente
    return () => subscription.remove();
  }, [isAuto]);

  // Função para alternar manualmente entre tema claro e escuro
  const toggleTheme = async (manualValue = null) => {
    if (manualValue !== null) {
      const newValue = manualValue === 'dark';
      setDarkMode(newValue); // Define o tema manualmente
      setIsAuto(false); // Sai do modo automático
      await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light'); // Salva a preferência
      await AsyncStorage.setItem('isAuto', 'false');
    } else {
      const newValue = !darkMode;
      setDarkMode(newValue); // Alterna o tema
      setIsAuto(false); // Sai do modo automático
      await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light'); // Salva a preferência
      await AsyncStorage.setItem('isAuto', 'false');
    }
  };

  // Função para alternar entre modo automático e manual
  const toggleAutoTheme = async () => {
    const newAutoValue = !isAuto;
    setIsAuto(newAutoValue); // Alterna o modo automático
    await AsyncStorage.setItem('isAuto', newAutoValue.toString());
    
    if (newAutoValue) {
      const systemTheme = Appearance.getColorScheme(); // Obtém o tema do sistema
      setDarkMode(systemTheme === 'dark'); // Atualiza o tema conforme o sistema
    }
  };

  // Provedor do contexto, disponibiliza os estados e funções para os componentes filhos
  return (
    <ThemeContext.Provider value={{ 
      darkMode,         // Booleano: indica se está no modo escuro
      toggleTheme,      // Função: alterna entre claro/escuro manualmente
      isAuto,           // Booleano: indica se está no modo automático
      toggleAutoTheme   // Função: alterna entre modo automático e manual
    }}>
      {children}
    </ThemeContext.Provider>
  );
};