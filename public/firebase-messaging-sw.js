importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCz1E-FC_E__D_kyCfGQEhZj6Joyr2qOCc",
  authDomain: "realbity-show.firebaseapp.com",
  databaseURL: "https://realbity-show-default-rtdb.firebaseio.com",
  projectId: "realbity-show",
  storageBucket: "realbity-show.firebasestorage.app",
  messagingSenderId: "906306319066",
  appId: "1:906306319066:web:d6ff8290df547f6b312be3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "REALBITY SHOW";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo_bw.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
