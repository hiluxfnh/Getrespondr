import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import db from "./firestore";

const notificationsCollection = collection(db, "notifications");

function getDeliveryChannels(preferences = {}) {
  const channels = ["in-app"];

  if (preferences.email !== false) {
    channels.push("email");
  }

  if (preferences.sms) {
    channels.push("sms");
  }

  if (preferences.push !== false) {
    channels.push("push");
  }

  return Array.from(new Set(channels));
}

function normalizeAudience(audience) {
  if (!Array.isArray(audience) || audience.length === 0) {
    return ["All"];
  }

  return audience;
}

function matchesAudience(notification, role) {
  const audience = normalizeAudience(notification.audience);
  const resolvedRole = role || "Viewer";

  return audience.includes("All") || audience.includes(resolvedRole);
}

export function listenToNotifications(role, callback, errorCallback, preferences = {}) {
  const notificationQuery = query(notificationsCollection, orderBy("createdAt", "desc"));
  const seenIds = new Set();

  return onSnapshot(
    notificationQuery,
    (snapshot) => {
      const notifications = snapshot.docs
        .map((notificationDoc) => ({ id: notificationDoc.id, ...notificationDoc.data() }))
        .filter((notification) => matchesAudience(notification, role));

      const pushEnabled = preferences.push !== false;
      const canShowBrowserNotification = typeof window !== "undefined" && "Notification" in window;

      if (pushEnabled && canShowBrowserNotification && window.Notification.permission === "granted") {
        notifications.forEach((notification) => {
          if (seenIds.has(notification.id)) {
            return;
          }

          seenIds.add(notification.id);
          const body = notification.description || notification.incidentTitle || "New incident alert";
          new window.Notification(notification.title, {
            body,
            tag: notification.id,
          });
        });
      }

      notifications.forEach((notification) => seenIds.add(notification.id));

      callback(notifications);
    },
    (error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  );
}

export async function createNotification(payload) {
  return addDoc(notificationsCollection, {
    type: payload.type || "incident",
    title: payload.title || "Notification",
    description: payload.description || "",
    severity: payload.severity || "Medium",
    audience: normalizeAudience(payload.audience),
    incidentId: payload.incidentId || null,
    incidentTitle: payload.incidentTitle || "",
    createdBy: payload.createdBy || "System",
    source: payload.source || "system",
    deliveryChannels: payload.deliveryChannels || getDeliveryChannels(payload.deliveryPreferences),
    metadata: payload.metadata || {},
    createdAt: serverTimestamp(),
  });
}

export function buildIncidentNotification({
  incident,
  changeType = "created",
  analysis = {},
  actorName = "System",
  deliveryPreferences = {},
}) {
  const title = changeType === "updated"
    ? `Incident updated: ${incident.title}`
    : `New incident reported: ${incident.title}`;

  const duplicateNote = analysis.duplicateMatches?.length
    ? ` Possible duplicates detected: ${analysis.duplicateMatches.slice(0, 2).map((item) => item.title).join(", ")}.`
    : "";

  const severityNote = analysis.suggestedSeverity && analysis.suggestedSeverity !== incident.severity
    ? ` AI suggests ${analysis.suggestedSeverity} severity.`
    : "";

  return {
    type: changeType === "updated" ? "update" : "incident",
    title,
    description: `${analysis.summary || incident.description || "Incident details updated."}${duplicateNote}${severityNote}`,
    severity: incident.severity || analysis.suggestedSeverity || "Medium",
    audience: ["Responder", "Coordinator", "Super Admin"],
    incidentId: incident.id || null,
    incidentTitle: incident.title || "Untitled incident",
    createdBy: actorName,
    source: "incident-flow",
    deliveryChannels: getDeliveryChannels(deliveryPreferences),
    metadata: {
      confidence: analysis.confidence ?? null,
      aiSource: analysis.source || "heuristic",
      duplicateMatches: analysis.duplicateMatches || [],
    },
  };
}

export { getDeliveryChannels };