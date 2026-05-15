import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import db from "../firebase/firestore";

const incidentsCollection = collection(db, "incidents");

/**
 * Listen to realtime dashboard statistics from Firestore.
 * @param {Function} callback - Called with stats object
 * @returns {Function} - Unsubscribe function
 */
export function listenToDashboardStats(callback) {
  return onSnapshot(
    query(incidentsCollection, orderBy("timestamp", "desc")),
    (snapshot) => {
      const incidents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const stats = {
        totalIncidents: incidents.length,
        activeIncidents: incidents.filter(
          (inc) => inc.status === "Active" || inc.status === "Investigating"
        ).length,
        criticalIncidents: incidents.filter((inc) => inc.severity === "Critical").length,
        resolvedIncidents: incidents.filter((inc) => inc.status === "Resolved").length,
        allIncidents: incidents,
      };

      callback(stats);
    },
    (error) => {
      console.error("Dashboard stats error:", error);
    }
  );
}

/**
 * Get realtime incident data for map and feed.
 * @param {Function} callback - Called with incidents array
 * @returns {Function} - Unsubscribe function
 */
export function listenToIncidentsForMap(callback) {
  return onSnapshot(
    query(incidentsCollection, orderBy("timestamp", "desc")),
    (snapshot) => {
      const incidents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(incidents);
    },
    (error) => {
      console.error("Map incidents error:", error);
    }
  );
}
