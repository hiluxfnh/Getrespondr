import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import db from "./firestore";

const resourcesCollection = collection(db, "resources");

export function listenToResources(callback, errorCallback) {
  const resourceQuery = query(resourcesCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    resourceQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((resourceDoc) => ({
          id: resourceDoc.id,
          ...resourceDoc.data(),
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

export async function createResource(payload) {
  return addDoc(resourcesCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateResource(id, payload) {
  return updateDoc(doc(db, "resources", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function removeResource(id) {
  return deleteDoc(doc(db, "resources", id));
}
