import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Login using Email and Cédula as Password
 */
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Register using Email and a user-chosen Password.
 * Returns the full UserCredential so caller can immediately save profile data.
 */
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.warn("Firestore: Error al leer perfil", error);
    throw error;
  }
};

/**
 * Admin: Get all registered profiles
 * Enhanced error reporting for Master User
 */
export const getAllProfiles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.error("ADMIN ERROR: No tienes permiso para listar usuarios. Revisa las reglas de seguridad en Firebase Console.");
    } else {
      console.error("Admin: Error inesperado al obtener perfiles", error);
    }
    return [];
  }
};

/**
 * Admin: Toggle VIP status
 */
export const setVipStatus = async (uid, isVip) => {
  const docRef = doc(db, "users", uid);
  return updateDoc(docRef, { vip: isVip, vipUpdatedAt: new Date().toISOString() });
};

/**
 * Master / Admin: Set User Role (Admin / User)
 */
export const setUserRole = async (uid, role) => {
  const docRef = doc(db, "users", uid);
  return updateDoc(docRef, { role: role });
};

/**
 * Master / Admin: Correct a locked user's name/cedula
 * This is the ONLY admin override of immutable identity fields.
 */
export const updateUserProfile = async (uid, fields) => {
  const docRef = doc(db, "users", uid);
  return updateDoc(docRef, { ...fields, correctedAt: new Date().toISOString() });
};

export const setupIdentity = async (uid, profile) => {
  const docRef = doc(db, "users", uid);
  return setDoc(docRef, {
    ...profile,
    locked: true,
    vip: false, // Default: not VIP
    createdAt: new Date().toISOString()
  });
};

export const saveResumeData = async (uid, data) => {
  const docRef = doc(db, "resumes", uid);
  return setDoc(docRef, {
    ...data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
};

export const getResumeData = async (uid) => {
  try {
    const docRef = doc(db, "resumes", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    return null;
  }
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
