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

const volunteersCollection = collection(db, "volunteers");

export function listenToVolunteers(callback, errorCallback) {
  const volunteerQuery = query(volunteersCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    volunteerQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((volunteerDoc) => ({
          id: volunteerDoc.id,
          ...volunteerDoc.data(),
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

export async function createVolunteer(payload) {
  return addDoc(volunteersCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateVolunteer(id, payload) {
  return updateDoc(doc(db, "volunteers", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function removeVolunteer(id) {
  return deleteDoc(doc(db, "volunteers", id));
}
