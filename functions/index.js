const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// ===============================
// 🔥 NOTIFICA MANUALE (ADMIN PANEL)
// ===============================
exports.sendChatNotification = functions.https.onRequest(async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).send("Missing title or body");
    }

    // Recupera tutti i token
    const tokensSnap = await admin.firestore().collection("devices").get();
    const tokens = [];
    tokensSnap.forEach((doc) => {
      const d = doc.data();
      if (d.token) tokens.push(d.token);
    });

    if (tokens.length === 0) {
      return res.status(200).send("No devices registered");
    }

    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        screen: "chat",
      },
    };

    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log("Manual notifications sent:", response.successCount);

    return res.status(200).send("Notification sent");
  } catch (err) {
    console.error("Error sending notification:", err);
    return res.status(500).send("Internal error");
  }
});

// ==========================================
// 🔥 NOTIFICHE AUTOMATICHE CHAT (NUOVA FUNZIONE)
// ==========================================
exports.notifyNewMessage = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const author = data.author || "Nuovo messaggio";
    const text = data.text || "Hai ricevuto un nuovo messaggio";

    // Recupera tutti i token registrati
    const tokensSnap = await admin.firestore().collection("devices").get();
    const tokens = [];
    tokensSnap.forEach((doc) => {
      const d = doc.data();
      if (d.token) tokens.push(d.token);
    });

    if (tokens.length === 0) {
      console.log("Nessun device registrato");
      return null;
    }

    const payload = {
      notification: {
        title: `Nuovo messaggio da ${author}`,
        body: text,
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        screen: "chat",
      },
    };

    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log("Automatic chat notifications sent:", response.successCount);

    return null;
  });

// ==========================================
// 🔥 REGISTRAZIONE TOKEN DISPOSITIVO
// (usata da notifications.js nel frontend)
// ==========================================
exports.registerDevice = functions.https.onRequest(async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).send("Missing userId or token");
    }

    await admin
      .firestore()
      .collection("devices")
      .doc(token)
      .set({
        userId,
        token,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return res.status(200).send("Device registered");
  } catch (err) {
    console.error("Error registering device:", err);
    return res.status(500).send("Internal error");
  }
});
