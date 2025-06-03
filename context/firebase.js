import { initializeApp } from 'firebase/app'; // Importa a função para inicializar o Firebase
import { getDatabase } from 'firebase/database'; // Importa a função para acessar o Realtime Database do Firebase
import Constants from 'expo-constants'; // Importa constantes de configuração do Expo

// Objeto de configuração do Firebase, usando variáveis do Expo (armazenadas em app.json ou app.config.js)
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey, // Chave de API do Firebase
  authDomain: Constants.expoConfig.extra.firebaseAuthDomain, // Domínio de autenticação do Firebase
  databaseURL: Constants.expoConfig.extra.firebaseDbUrl, // URL do Realtime Database do Firebase
  projectId: Constants.expoConfig.extra.firebaseProjectId, // ID do projeto no Firebase
  storageBucket: Constants.expoConfig.extra.firebaseStorageBucket, // Bucket de armazenamento do Firebase
  messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId, // ID do remetente de mensagens do Firebase
  appId: Constants.expoConfig.extra.firebaseAppId, // ID do aplicativo Firebase
};

// Inicializa o app Firebase com as configurações acima
const app = initializeApp(firebaseConfig);

// Obtém uma referência ao Realtime Database do Firebase usando o app inicializado
const database = getDatabase(app);

// Exporta a referência do database para ser usada em outros arquivos do projeto
export { database };