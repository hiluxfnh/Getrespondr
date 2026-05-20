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

const tasksCollection = collection(db, "tasks");

export function listenToTasks(callback, errorCallback) {
  const taskQuery = query(tasksCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    taskQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((taskDoc) => ({
          id: taskDoc.id,
          ...taskDoc.data(),
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

export async function createTask(payload) {
  return addDoc(tasksCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(id, payload) {
  return updateDoc(doc(db, "tasks", id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function removeTask(id) {
  return deleteDoc(doc(db, "tasks", id));
}
