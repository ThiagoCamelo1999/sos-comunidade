// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "SOS Comunidade",
    slug: "sos-comunidade-v2",
    owner: "thiago.camelo1999",
    version: "9.2.4",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#2d2d30"
    },
    ios: {
      supportsTablet: true,
      userInterfaceStyle: "automatic"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#2d2d30"
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ],
      package: "com.thiago.camelo1999.soscomunidadev2",
      userInterfaceStyle: "automatic"
    },
    androidStatusBar: {
      barStyle: "light-content",
      backgroundColor: "#2d2d30"
    },
    web: {
      favicon: "./assets/favicon.png",
      backgroundColor: "#2d2d30"
    },
    extra: {
      orsApiKey: process.env.ORS_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseDbUrl: process.env.FIREBASE_DB_URL,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      eas: {
        projectId: "08b03316-1239-4ca0-890f-b499e5cf99a4"
      }
    },
    plugins: [
      "expo-asset"
    ]
  }
};
