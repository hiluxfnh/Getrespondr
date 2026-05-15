import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import db from "./firestore";

const incidentsCollection = collection(db, "incidents");

export function listenToIncidents(callback, errorCallback) {
  const incidentQuery = query(incidentsCollection, orderBy("timestamp", "desc"));
  return onSnapshot(
    incidentQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((incidentDoc) => ({
          id: incidentDoc.id,
          ...incidentDoc.data(),
        }))
      );
    },
    (error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  );
}

export async function loadIncident(id) {
  const snapshot = await getDoc(doc(db, "incidents", id));
  if (!snapshot.exists()) {
    return null;
  }
  return { id: snapshot.id, ...snapshot.data() };
}

export async function createIncident(payload) {
  const images = payload.imageUrl ? [payload.imageUrl] : [];
  return addDoc(incidentsCollection, {
    ...payload,
    imageUrl: payload.imageUrl || "",
    images,
    timestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateIncident(id, payload) {
  const images = payload.imageUrl ? [payload.imageUrl] : (payload.images || []);
  return updateDoc(doc(db, "incidents", id), {
    ...payload,
    images,
    updatedAt: serverTimestamp(),
  });
}

export async function removeIncident(id) {
  return deleteDoc(doc(db, "incidents", id));
}
