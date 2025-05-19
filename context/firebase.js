// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Substitua pelos seus dados reais do console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCL6BIZF6kPW2UyLazELGME-pgDQjWkTqA",
  authDomain: "sos-comunidade-a98de.firebaseapp.com",
  databaseURL: "https://sos-comunidade-a98de-default-rtdb.firebaseio.com",
  projectId: "sos-comunidade-a98de",
  storageBucket: "sos-comunidade-a98de.firebasestorage.app",
  messagingSenderId: "866804066019",
  appId: "1:866804066019:web:fabac0c4ab1176c8a447d6"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
