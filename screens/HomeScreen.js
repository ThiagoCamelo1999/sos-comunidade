import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { theme } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { stopBackgroundTracking } from '../context/locationTask';

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
  const [isTracking, setIsTracking] = useState(false);

  const colors = theme.colors[darkMode ? 'dark' : 'light'];

  // ✅ Verifica continuamente se o rastreamento está ativo
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const id = await AsyncStorage.getItem('rastreioId');
        const running = await Location.hasStartedLocationUpdatesAsync('location-tracking');
        const rastreando = !!(id && running);

        setIsTracking(prev => {
          if (prev !== rastreando) {
            console.log('🔄 [HomeScreen] Atualizando estado de rastreamento para:', rastreando);
            if (rastreando) {
              Alert.alert('📡 Rastreamento Ativo', 'Você está sendo rastreado em tempo real.');
            }
          }
          return rastreando;
        });
      } catch (err) {
        console.error('⚠️ Erro ao verificar rastreamento:', err);
      }
    }, 2000); // ⏱️ Verifica a cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  const handleEmergencyPress = (tipo) => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('Emergencia', { tipo });
      setLoading(false);
    }, 500);
  };

  const encerrarRastreamento = () => {
    Alert.alert(
      '⛔ Encerrar Rastreamento',
      'Tem certeza que deseja encerrar o rastreamento em tempo real?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: async () => {
            try {
              await stopBackgroundTracking();
              setIsTracking(false);
              Alert.alert('✅ Rastreamento encerrado');
            } catch (err) {
              console.error('❌ Erro ao parar rastreamento:', err);
              Alert.alert('Erro', 'Não foi possível parar o rastreamento.');
            }
          },
        },
      ]
    );
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
            <Text style={[styles.themeModeText, { color: colors.text }]}> {isAuto ? '🌞🌙 Automático' : darkMode ? '🌙 Escuro' : '🌞 Claro'} </Text>
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
          <Text style={[styles.title, { color: colors.text, fontSize: theme.typography.title, marginBottom: theme.spacing.small }]}>SOS Comunidade 🚨</Text>
          <Text style={[styles.subtitle, { color: colors.text, fontSize: theme.typography.subtitle }]}>Escolha o tipo de emergência:</Text>
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
                  style={[styles.emergencyButton, { backgroundColor: colors.primary, marginVertical: theme.spacing.small }]}
                  activeOpacity={0.7}
                  onPress={() => handleEmergencyPress(item.tipo)}
                >
                  <Text style={[styles.buttonText, { fontSize: theme.typography.button }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão de Ajuda */}
            <TouchableOpacity
              style={[styles.helpButton, { backgroundColor: colors.secondary, marginTop: theme.spacing.medium }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Ajuda')}
            >
              <Text style={[styles.buttonText, { fontSize: theme.typography.button }]}>❓ Ajuda</Text>
            </TouchableOpacity>

            {/* Botão de Encerrar Rastreamento */}
            {isTracking && (
              <TouchableOpacity
                style={[styles.helpButton, { backgroundColor: '#ff6b6b', marginTop: 24 }]}
                activeOpacity={0.8}
                onPress={encerrarRastreamento}
              >
                <Text style={[styles.buttonText, { fontSize: 16 }]}>⛔ Parar Rastreamento</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
