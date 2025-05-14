// context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    // Carrega as preferências salvas
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedIsAuto = await AsyncStorage.getItem('isAuto');
      
      if (savedIsAuto !== null) {
        setIsAuto(savedIsAuto === 'true');
      }
      
      if (savedTheme !== null && savedIsAuto === 'false') {
        setDarkMode(savedTheme === 'dark');
      } else if (savedIsAuto === 'true') {
        const systemTheme = Appearance.getColorScheme();
        setDarkMode(systemTheme === 'dark');
      }
    })();

    // Listener para mudanças no tema do sistema
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isAuto) {
        setDarkMode(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, [isAuto]);

  const toggleTheme = async (manualValue = null) => {
    if (manualValue !== null) {
      const newValue = manualValue === 'dark';
      setDarkMode(newValue);
      setIsAuto(false);
      await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
      await AsyncStorage.setItem('isAuto', 'false');
    } else {
      const newValue = !darkMode;
      setDarkMode(newValue);
      setIsAuto(false);
      await AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
      await AsyncStorage.setItem('isAuto', 'false');
    }
  };

  const toggleAutoTheme = async () => {
    const newAutoValue = !isAuto;
    setIsAuto(newAutoValue);
    await AsyncStorage.setItem('isAuto', newAutoValue.toString());
    
    if (newAutoValue) {
      const systemTheme = Appearance.getColorScheme();
      setDarkMode(systemTheme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleTheme, 
      isAuto, 
      toggleAutoTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};