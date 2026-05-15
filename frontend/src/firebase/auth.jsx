import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseApp } from "./firebase";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function createDefaultProfile(email, extra = {}) {
  return {
    email,
    role: "Viewer",
    displayName: extra.displayName || "",
    phoneNumber: extra.phoneNumber || "",
    jobTitle: extra.jobTitle || "",
    department: extra.department || "",
    organization: extra.organization || "",
    location: extra.location || "",
    timezone: extra.timezone || "",
    language: extra.language || "",
    bio: extra.bio || "",
    avatarUrl: extra.avatarUrl || "",
    notificationPreferences: extra.notificationPreferences || {
      email: true,
      sms: true,
      push: true,
    },
    roleRequest: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const USER_ROLES = [
  "Super Admin",
  "Coordinator",
  "Volunteer",
  "Responder",
  "Viewer",
];

const AuthContext = createContext({
  user: null,
  loading: true,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  requestRole: async () => {},
  updateProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setUser({ uid: firebaseUser.uid, ...snap.data() });
          } else {
            const profile = createDefaultProfile(firebaseUser.email, {
              displayName: firebaseUser.displayName || "",
            });
            await setDoc(ref, profile);
            setUser({ uid: firebaseUser.uid, ...profile });
          }
        } catch (err) {
          console.error("Failed to load user profile", err);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  async function register(email, password, extra = {}) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    const profile = createDefaultProfile(email, extra);
    await setDoc(doc(db, "users", uid), profile);
    setUser({ uid, ...profile });
    return res.user;
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
  }

  async function requestRole(role) {
    if (!auth.currentUser) {
      throw new Error("You must be signed in to request access.");
    }

    if (!USER_ROLES.includes(role) || role === "Viewer" || role === "Super Admin") {
      throw new Error("This role cannot be requested.");
    }

    const uid = auth.currentUser.uid;
    const currentRole = user?.role || "Viewer";

    if (currentRole === role) {
      return { status: "already_assigned", role };
    }

    if (role === "Volunteer" || role === "Responder") {
      await updateDoc(doc(db, "users", uid), {
        role,
        roleRequest: null,
        roleRequestedAt: null,
        roleApprovedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setUser((prev) => (prev ? { ...prev, role, roleRequest: null } : prev));
      return { status: "approved", role };
    }

    await setDoc(
      doc(db, "role_requests", uid),
      {
        uid,
        email: auth.currentUser.email || "",
        displayName: user?.displayName || "",
        currentRole,
        requestedRole: role,
        status: "pending",
        requestedAt: serverTimestamp(),
      },
      { merge: true },
    );

    await updateDoc(doc(db, "users", uid), {
      roleRequest: role,
      roleRequestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setUser((prev) => (prev ? { ...prev, roleRequest: role } : prev));
    return { status: "pending", role };
  }

  async function updateProfile(updates) {
    if (!auth.currentUser) {
      throw new Error("You must be signed in to update your profile.");
    }

    const uid = auth.currentUser.uid;
    const payload = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", uid), payload, { merge: true });
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    return payload;
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, requestRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children, fallback = "/login" }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to={fallback} replace />;
  return children;
}

export function RoleRoute({ children, allowedRoles = [], fallback = "/dashboard" }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }
  return children;
}

export default AuthProvider;
