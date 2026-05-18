import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLFbjp_Nmj-j0CQEf2f2FO5Qgo3DreGlE",
  authDomain: "cafe-hop-app.firebaseapp.com",
  projectId: "cafe-hop-app",
  storageBucket: "cafe-hop-app.firebasestorage.app",
  messagingSenderId: "200827634265",
  appId: "1:200827634265:web:71d8ea8faf97de0bab2748",
  measurementId: "G-M9DP5BZ03Z"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };