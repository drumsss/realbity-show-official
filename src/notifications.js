import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { requestPermissionAndGetToken } from "./firebase";

export const registerDevice = async (userId) => {
  const token = await requestPermissionAndGetToken();
  if (!token) return;

  await setDoc(doc(db, "devices", token), {
    userId,
    token,
    createdAt: Date.now(),
  });
};
