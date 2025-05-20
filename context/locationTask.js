// context/locationTask.js
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { database } from './firebase'; // Ajuste conforme a estrutura real
import { ref, set } from 'firebase/database';

const TASK_NAME = 'location-tracking';

// Task definida uma vez globalmente
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('❌ Erro no TaskManager:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    if (location) {
      const { latitude, longitude } = location.coords;
      const rastreioId = globalThis.rastreioId;

      if (!rastreioId) {
        console.warn('⚠️ rastreioId não definido!');
        return;
      }

      console.log(`📍 Background update: ${latitude}, ${longitude}`);

      const refLocal = ref(database, `rastreamento/${rastreioId}`);
      try {
        await set(refLocal, {
          latitude,
          longitude,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error('🔥 Firebase erro ao enviar localização:', err);
      }
    }
  }
});

export const startBackgroundTracking = async (id) => {
  globalThis.rastreioId = id;

  // Permissão em primeiro plano
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== 'granted') {
    alert('Permissão de localização em primeiro plano negada.');
    return;
  }

  // Permissão em segundo plano
  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  if (bg !== 'granted') {
    alert('Permissão de rastreamento em segundo plano negada.');
    return;
  }

  const started = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  if (!started) {
    await Location.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000, // a cada 10 segundos
      distanceInterval: 10, // ou a cada 10 metros
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'SOS Comunidade',
        notificationBody: 'Rastreamento ativo em segundo plano.',
        notificationColor: '#ff6b6b'
      }
    });
    console.log('✅ Rastreamento em segundo plano iniciado');
  } else {
    console.log('ℹ️ Já estava em rastreamento');
  }
};

export const stopBackgroundTracking = async () => {
  const started = await Location.hasStartedLocationUpdatesAsync(TASK_NAME);
  if (started) {
    await Location.stopLocationUpdatesAsync(TASK_NAME);
    globalThis.rastreioId = null;
    console.log('🛑 Rastreamento em segundo plano encerrado');
  }
};

