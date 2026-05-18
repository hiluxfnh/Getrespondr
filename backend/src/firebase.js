import fs from "fs";
import admin from "firebase-admin";

import { config } from "./config.js";

let db = null;

export function initFirebase() {
  if (admin.apps.length) {
    return admin.firestore();
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(config.firebaseServiceAccountPath, "utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
  return db;
}

export function getDb() {
  if (!db) {
    return initFirebase();
  }
  return db;
}

export { admin };
