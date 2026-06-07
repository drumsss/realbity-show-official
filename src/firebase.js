import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz1E-FC_E__D_kyCfGQEhZj6Joyr2qOCc",
  authDomain: "realbity-show.firebaseapp.com",
  databaseURL: "https://realbity-show-default-rtdb.firebaseio.com",
  projectId: "realbity-show",
  storageBucket: "realbity-show.firebasestorage.app",
  messagingSenderId: "906306319066",
  appId: "1:906306319066:web:d6ff8290df547f6b312be3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export const requestPermissionAndGetToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BO_4kvh6mI6cUWbmV-_TRHi5_KVG1QoNdX5wK6yDOGoVIZJuGGpszdi2ixJ3xB6Mn3DdS4ln8d2yDZPjMGhJesnA",
    });
    return token;
  } catch (err) {
    console.error("Errore token:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => resolve(payload));
  });
