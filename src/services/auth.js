import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "./firebase";

// Las funciones de Firestore se cargan dinámicamente para no pesar en el inicio
const getFirestoreDeps = async () => {
  const { doc, getDoc, setDoc, updateDoc, collection, getDocs, getFirestore } = await import("firebase/firestore");
  const { default: app } = await import("./firebase");
  const db = getFirestore(app);
  return { doc, getDoc, setDoc, updateDoc, collection, getDocs, db };
};

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export const getUserProfile = async (uid) => {
  const { doc, getDoc, db } = await getFirestoreDeps();
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? docSnap.data() : null;
};

export const getResumeData = async (uid) => {
  try {
    const { doc, getDoc, db } = await getFirestoreDeps();
    const docSnap = await getDoc(doc(db, "resumes", uid));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (e) { return null; }
};

export const saveResumeData = async (uid, data) => {
  const { doc, setDoc, db } = await getFirestoreDeps();
  return setDoc(doc(db, "resumes", uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
};

export const setupIdentity = async (uid, profile) => {
  const { doc, setDoc, db } = await getFirestoreDeps();
  return setDoc(doc(db, "users", uid), {
    ...profile,
    locked: true,
    vip: false,
    createdAt: new Date().toISOString()
  });
};

export const updateUserProfile = async (uid, fields) => {
  const { doc, updateDoc, db } = await getFirestoreDeps();
  return updateDoc(doc(db, "users", uid), { ...fields, correctedAt: new Date().toISOString() });
};

// BUG FIX: Propagar la cédula corregida también a la colección 'resumes' para
// que el cuestionario la refleje inmediatamente tras la corrección del admin.
export const updateUserCedulaInResume = async (uid, cedula) => {
  try {
    const { doc, setDoc, db } = await getFirestoreDeps();
    return setDoc(doc(db, "resumes", uid), { cedula }, { merge: true });
  } catch (e) { /* Si el documento 'resumes' aún no existe, se ignora sin error */ }
};


export const getAllProfiles = async () => {
  const { collection, getDocs, db } = await getFirestoreDeps();
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

export const setVipStatus = async (uid, isVip) => {
  const { doc, updateDoc, db } = await getFirestoreDeps();
  return updateDoc(doc(db, "users", uid), { vip: isVip, vipUpdatedAt: new Date().toISOString() });
};

export const setUserRole = async (uid, role) => {
  const { doc, updateDoc, db } = await getFirestoreDeps();
  return updateDoc(doc(db, "users", uid), { role });
};

export const activatePartnerSubscription = async (uid, months = 1) => {
  const { doc, updateDoc, db } = await getFirestoreDeps();
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + (months * 30));
  return updateDoc(doc(db, "users", uid), {
    role: "partner",
    subActive: true,
    subExpires: expiresDate.toISOString(),
    subActivatedAt: new Date().toISOString()
  });
};

export const deactivatePartnerSubscription = async (uid) => {
  const { doc, updateDoc, db } = await getFirestoreDeps();
  return updateDoc(doc(db, "users", uid), {
    role: "user",
    subActive: false,
    subExpires: null,
    subDeactivatedAt: new Date().toISOString()
  });
};

export const savePaymentData = async (uid, paymentInfo) => {
  const { doc, setDoc, db } = await getFirestoreDeps();
  return setDoc(doc(db, "payments", uid), { ...paymentInfo, paidAt: new Date().toISOString() }, { merge: true });
};

export const getPaymentData = async (uid) => {
  const { doc, getDoc, db } = await getFirestoreDeps();
  const docSnap = await getDoc(doc(db, "payments", uid));
  return docSnap.exists() ? docSnap.data() : null;
};

export const subscribeToAuthChanges = (callback) => onAuthStateChanged(auth, callback);

export const notifyNewSale = async (profile, amount, method = 'PayPhone') => {
  const { doc, collection, setDoc, db } = await getFirestoreDeps();
  const saleData = {
    userName: profile?.fullName || 'Usuario',
    userEmail: profile?.email || 'S/E',
    amount: amount / 100,
    method: method,
    timestamp: new Date().toISOString()
  };
  await setDoc(doc(collection(db, "sales")), saleData);
  fetch("https://formsubmit.co/ajax/ks_mvp@icloud.com", {
    method: "POST", headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _subject: "💰 NUEVA VENTA VIP", ...saleData })
  }).catch(() => {});
};
