// context/locationTask.js

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { database } from './firebase';
import { ref, push, update } from 'firebase/database'; // ✅ Incluído update para salvar meta
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Persistência

const TASK_NAME = 'location-tracking';

// Variáveis globais para controle de envio
let lastCoords = null; // Última coordenada registrada
let lastTimestamp = 0; // Último tempo em que uma posição foi enviada
const MIN_DISTANCE_METERS = 0; // ⬅️ Qualquer deslocamento conta (0m)
const MAX_INTERVAL_MS = 30000;  // ⬅️ 30 segundos mesmo parado
let metaSalva = false; // ⬅️ Controle para salvar meta.localInicio apenas uma vez

// Define a task de rastreamento em segundo plano
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  console.log('📡 TaskManager acionado com dados:', data);
  if (error) {
    console.error('❌ Erro no TaskManager:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    if (location) {
      const { latitude, longitude, accuracy } = location.coords;
      const now = Date.now();
      const rastreioId = globalThis.rastreioId;

      if (!rastreioId) {
        console.warn('⚠️ rastreioId não definido!');
        return;
      }

      console.log(`📍 Nova localização recebida: (${latitude}, ${longitude})`);
      console.log(`📏 Precisão: ${accuracy} metros`);

      // Filtro 1: ignora localizações com baixa precisão
      if (accuracy > 100) {
        console.warn('⛔ Localização ignorada por baixa precisão (>100m)');
        return;
      }

      // Filtro 2: distância desde último envio
      let distancia = Infinity;
      if (lastCoords) {
        const dx = latitude - lastCoords.latitude;
        const dy = longitude - lastCoords.longitude;
        distancia = Math.sqrt(dx * dx + dy * dy) * 111139;
      }

      const tempoDesdeUltimo = now - lastTimestamp;

      if (distancia < MIN_DISTANCE_METERS && tempoDesdeUltimo < MAX_INTERVAL_MS) {
        console.log(`⏸️ Ignorado: ${distancia.toFixed(1)}m em ${Math.floor(tempoDesdeUltimo / 1000)}s`);
        return;
      }

      // Atualiza últimos dados
      lastCoords = { latitude, longitude };
      lastTimestamp = now;

      const refLocal = ref(database, `rastreamento/${rastreioId}`);

      // ✅ Salva a posição inicial uma única vez em meta.localInicio
      if (!metaSalva) {
        const metaRef = ref(database, `rastreamento/${rastreioId}/meta`);
        try {
          await update(metaRef, {
            localInicio: { latitude, longitude },
            iniciadoEm: now,
          });
          metaSalva = true;
          console.log('🟢 meta.localInicio salva com sucesso');
        } catch (e) {
          console.error('❌ Erro ao salvar meta.localInicio:', e);
        }
      }

      // ✅ Envia ponto para o histórico
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

// Início do rastreamento
export const startBackgroundTracking = async (id) => {
  console.log('🟡 [startBackgroundTracking] Iniciando rastreamento com ID:', id);
  globalThis.rastreioId = id;
  metaSalva = false; // ✅ Resetar controle ao iniciar

  try {
    await AsyncStorage.setItem('rastreioId', id);
    console.log('💾 rastreioId salvo no AsyncStorage');
  } catch (e) {
    console.error('❌ Erro ao salvar rastreioId:', e);
  }

  // Permissões
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  console.log('🔍 Permissão de localização (foreground):', fg);
  if (fg !== 'granted') return alert('Permissão negada (foreground)');

  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  console.log('🔍 Permissão de localização (background):', bg);
  if (bg !== 'granted') return alert('Permissão negada (background)');

  try {
    const started = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
    console.log('📦 Já iniciou?', started);

    if (!started) {
      console.log('🛠️ Iniciando localização em segundo plano...');
      await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 1,
        showsBackgroundLocationIndicator: true,
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

// Parar rastreamento
export const stopBackgroundTracking = async () => {
  console.log('🟡 [stopBackgroundTracking] Parando rastreamento');
  const rastreioId = globalThis.rastreioId;
  globalThis.rastreioId = null;

  try {
    await AsyncStorage.removeItem('rastreioId');
    console.log('🗑️ rastreioId removido do AsyncStorage');
  } catch (e) {
    console.error('❌ Erro ao remover rastreioId:', e);
  }

  try {
    await Location.stopLocationUpdatesAsync(TASK_NAME);
    console.log('✅ Rastreamento parado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao parar rastreamento:', error);
    alert('Erro ao parar rastreamento. Veja o console.');
  }

  // ✅ Registra finalização no Firebase
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

// Restaurar rastreio ativo ao abrir app
(async () => {
  try {
    const savedId = await AsyncStorage.getItem('rastreioId');
    const isRunning = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);

    if (savedId && isRunning) {
      globalThis.rastreioId = savedId;
      console.log('🔁 Rastreio restaurado automaticamente com ID:', savedId);
    } else {
      console.log('ℹ️ Nenhum rastreamento ativo ou ID salvo');
    }
  } catch (err) {
    console.error('⚠️ Erro ao restaurar rastreamento:', err);
  }
})();
