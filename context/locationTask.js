// context/locationTask.js

// Importa módulos necessários do Expo, Firebase e AsyncStorage
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { database } from './firebase';
import { ref, push, update } from 'firebase/database'; // Para manipular dados no Firebase
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para persistência local

const TASK_NAME = 'location-tracking'; // Nome da task de rastreamento

// Variáveis globais para controle de envio de localização
let lastCoords = null; // Guarda a última coordenada enviada
let lastTimestamp = 0; // Guarda o timestamp do último envio
const MIN_DISTANCE_METERS = 0; // Distância mínima para enviar nova localização (0 = qualquer movimento)
const MAX_INTERVAL_MS = 30000;  // Intervalo máximo entre envios (30s)
let metaSalva = false; // Controle para salvar o ponto inicial apenas uma vez

// Define a task de rastreamento em segundo plano
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  // Função chamada automaticamente pelo sistema quando há nova localização
  console.log('📡 TaskManager acionado com dados:', data);

  if (error) {
    // Se ocorrer erro, loga e retorna
    console.error('❌ Erro no TaskManager:', error);
    return;
  }

  if (data) {
    // Se houver dados de localização
    const { locations } = data;
    const location = locations[0]; // Pega a primeira localização recebida

    if (location) {
      // Extrai latitude, longitude e precisão
      const { latitude, longitude, accuracy } = location.coords;
      const now = Date.now(); // Timestamp atual
      const rastreioId = globalThis.rastreioId; // ID do rastreamento global

      if (!rastreioId) {
        // Se não houver ID, não faz nada
        console.warn('⚠️ rastreioId não definido!');
        return;
      }
      console.log(`📍 Nova localização recebida: (${latitude}, ${longitude})`);
      console.log(`📏 Precisão: ${accuracy} metros`);

      // Filtro 1: ignora localizações com precisão ruim (>100m)
      if (accuracy > 100) {
        console.warn('⛔ Localização ignorada por baixa precisão (>100m)');
        return;
      }

      // Filtro 2: ignora se não houve deslocamento suficiente ou intervalo mínimo
      let distancia = Infinity;
      if (lastCoords) {
        // Calcula distância em metros entre última e nova posição
        const dx = latitude - lastCoords.latitude;
        const dy = longitude - lastCoords.longitude;
        distancia = Math.sqrt(dx * dx + dy * dy) * 111139;
      }

      const tempoDesdeUltimo = now - lastTimestamp;

      if (distancia < MIN_DISTANCE_METERS && tempoDesdeUltimo < MAX_INTERVAL_MS) {
                console.log(`⏸️ Ignorado: ${distancia.toFixed(1)}m em ${Math.floor(tempoDesdeUltimo / 1000)}s`);
        // Se não passou nem a distância nem o tempo mínimo, ignora
        return;
      }

      // Atualiza última posição e tempo
      lastCoords = { latitude, longitude };
      lastTimestamp = now;

      const refLocal = ref(database, `rastreamento/${rastreioId}`);

      // Salva a posição inicial uma única vez em meta.localInicio
      if (!metaSalva) {
        const metaRef = ref(database, `rastreamento/${rastreioId}/meta`);
        try {
          await update(metaRef, {
            localInicio: { latitude, longitude },
            iniciadoEm: now,
          });
          metaSalva = true; // Marca que já salvou
                    console.log('🟢 meta.localInicio salva com sucesso');
        } catch (e) {
          console.error('❌ Erro ao salvar meta.localInicio:', e);
        }
      }

      // Envia ponto para o histórico no Firebase
      try {
        await push(refLocal, {
          latitude,
          longitude,
          accuracy,
          timestamp: now,
        });
                console.log('✅ Localização enviada ao Firebase');
      } catch (err) {
        console.error('🔥 Erro ao enviar localização para o Firebase:', err);
      }
    }
  }
});

// Função para iniciar o rastreamento em background
export const startBackgroundTracking = async (id) => {
  console.log('🟡 [startBackgroundTracking] Iniciando rastreamento com ID:', id);
  // Salva o ID globalmente e reseta metaSalva
  globalThis.rastreioId = id;
  metaSalva = false;// Resetar controle ao iniciar

  // Salva o ID no AsyncStorage para persistência
  try {
    await AsyncStorage.setItem('rastreioId', id);
    console.log('💾 rastreioId salvo no AsyncStorage');
  } catch (e) {
    console.error('❌ Erro ao salvar rastreioId:', e);
  }

  // Solicita permissões de localização foreground e background
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
    console.log('🔍 Permissão de localização (foreground):', fg);

  if (fg !== 'granted') return alert('Permissão negada (foreground)');

  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
    console.log('🔍 Permissão de localização (background):', bg);
  if (bg !== 'granted') return alert('Permissão negada (background)');

  // Inicia o serviço de localização em background se ainda não estiver rodando
  try {
    const started = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
        console.log('📦 Já iniciou?', started);
    if (!started) {
      console.log('🛠️ Iniciando localização em segundo plano...');
      // Inicia o rastreamento com as configurações desejadas
      await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy.High, // Alta precisão
        timeInterval: 10000, // Intervalo mínimo entre atualizações (ms)
        distanceInterval: 1, // Distância mínima entre atualizações (m)
        showsBackgroundLocationIndicator: true, // Mostra indicador no iOS
        foregroundService: {
          notificationTitle: 'SOS Comunidade',
          notificationBody: 'Rastreamento ativo em segundo plano.',
          notificationColor: '#ff6b6b',
        },
      });
console.log('✅ Rastreamento iniciado com sucesso!');
    } else {
      console.log('ℹ️ Rastreamento já estava ativo.');
    }
  } catch (error) {
    console.error('❌ Erro ao iniciar rastreamento:', error);
    alert('Erro ao iniciar rastreamento. Veja o console.');
  }
};

// Função para parar o rastreamento em background
export const stopBackgroundTracking = async () => {
    console.log('🟡 [stopBackgroundTracking] Parando rastreamento');
  // Limpa o ID global e remove do AsyncStorage
  const rastreioId = globalThis.rastreioId;
  globalThis.rastreioId = null;

  try {
    await AsyncStorage.removeItem('rastreioId');
        console.log('🗑️ rastreioId removido do AsyncStorage');
  } catch (e) {
    console.error('❌ Erro ao remover rastreioId:', e);
  }

  // Para o serviço de localização em background
  try {
    await Location.stopLocationUpdatesAsync(TASK_NAME);
        console.log('✅ Rastreamento parado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao parar rastreamento:', error);
    alert('Erro ao parar rastreamento. Veja o console.');
  }

  // Salva no Firebase o timestamp de finalização
  if (rastreioId) {
    const metaRef = ref(database, `rastreamento/${rastreioId}/meta`);
    try {
      await update(metaRef, {
        finalizadoEm: Date.now(),
      });
            console.log('🔴 Rastreamento finalizado no Firebase');
    } catch (e) {
      console.error('❌ Erro ao salvar finalizadoEm:', e);
    }
  }
};

// Função auto-executada para restaurar rastreamento ativo ao abrir o app
(async () => {
  try {
    const savedId = await AsyncStorage.getItem('rastreioId'); // Recupera ID salvo
    const isRunning = await Location.hasStartedLocationUpdatesAsync(TASK_NAME); // Verifica se serviço está rodando

    if (savedId && isRunning) {
      // Se houver ID salvo e serviço rodando, restaura o rastreio
      globalThis.rastreioId = savedId;
    }
  } catch (err) {
    console.error('⚠️ Erro ao restaurar rastreamento:', err);
  }
})();

