import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { theme } from '../theme'; // Importa o tema centralizado

// Botões de emergência (pode ser movido para um arquivo de constantes se desejar)
const emergencyButtons = [
  { tipo: 'policia', label: '🚔 Polícia' },
  { tipo: 'bombeiros', label: '🚒 Bombeiros' },
  { tipo: 'hospitais', label: '🏥 Hospitais' },
  { tipo: 'upas', label: '🏪 UPAs' },
  { tipo: 'samu', label: '🚑 SAMU' },
];

export default function HomeScreen({ navigation }) {
  const { darkMode, toggleTheme, isAuto, toggleAutoTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  
  // Obtém as cores do tema atual
  const colors = theme.colors[darkMode ? 'dark' : 'light'];

  const handleEmergencyPress = (tipo) => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('Emergencia', { tipo });
      setLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { 
            padding: theme.spacing.large,
            flexGrow: 1 
          }
        ]}
      >
        {/* Controle de Tema */}
        <View style={styles.themeControlContainer}>
          <TouchableOpacity 
            onPress={toggleAutoTheme} 
            style={styles.themeModeButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.themeModeText, { color: colors.text }]}>
              {isAuto ? '🌞🌙 Automático' : darkMode ? '🌙 Escuro' : '🌞 Claro'}
            </Text>
          </TouchableOpacity>
          
          {!isAuto && (
            <Switch
              value={darkMode}
              onValueChange={(value) => toggleTheme(value ? 'dark' : 'light')}
              trackColor={{ false: colors.switchTrack, true: colors.switchTrack }}
              thumbColor={colors.switchThumb}
            />
          )}
        </View>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={[
            styles.title, 
            { 
              color: colors.text,
              fontSize: theme.typography.title,
              marginBottom: theme.spacing.small
            }]}>
            SOS Comunidade 🚨
          </Text>
          <Text style={[
            styles.subtitle, 
            { 
              color: colors.text,
              fontSize: theme.typography.subtitle
            }]}>
            Escolha o tipo de emergência:
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.loading} />
          </View>
        ) : (
          <>
            {/* Botões de Emergência */}
            <View style={styles.buttonGrid}>
              {emergencyButtons.map(item => (
                <TouchableOpacity
                  key={item.tipo}
                  style={[
                    styles.emergencyButton, 
                    { 
                      backgroundColor: colors.primary,
                      marginVertical: theme.spacing.small
                    }
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleEmergencyPress(item.tipo)}
                >
                  <Text style={[
                    styles.buttonText,
                    { fontSize: theme.typography.button }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão de Ajuda */}
            <TouchableOpacity
              style={[
                styles.helpButton, 
                { 
                  backgroundColor: colors.secondary,
                  marginTop: theme.spacing.medium
                }
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Ajuda')}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: theme.typography.button }
              ]}>
                ❓ Ajuda
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (não dependem do tema)
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  themeControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  themeModeButton: {
    marginRight: 10,
  },
  themeModeText: {
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  buttonGrid: {
    width: '100%',
    alignItems: 'center',
  },
  emergencyButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  helpButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});