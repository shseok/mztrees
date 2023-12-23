// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app';
import { type Analytics, getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;
let isInitialized = false;

// Initialize Firebase > 최초 한 번 실행 (앱 진입 or 새로고침)
export function initializeAnalytics() {
  if (isInitialized) return;
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  analytics = getAnalytics(app);
  isInitialized = true;
}

export function getFirebaseAnalytics() {
  return analytics;
}
