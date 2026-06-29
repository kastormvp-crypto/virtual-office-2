import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBodOkbG502cniXWKxK29qZuCYN2ztb4vo",
  authDomain: "virtuals2.firebaseapp.com",
  projectId: "virtuals2",
  storageBucket: "virtuals2.firebasestorage.app",
  messagingSenderId: "171287146583",
  appId: "1:171287146583:web:380661be04672e2b71f312"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  console.log("Checking 'users' collection...");
  const qUsers = query(collection(db, 'users'), where('cedula', '==', '1720177805'), limit(1));
  const snapUsers = await getDocs(qUsers).catch(e => console.error("Users error:", e.message));
  if (snapUsers && !snapUsers.empty) console.log("Found in users!", snapUsers.docs[0].id);
  else console.log("Not found in users.");

  console.log("Checking 'resumes' collection...");
  const qResumes = query(collection(db, 'resumes'), where('cedula', '==', '1720177805'));
  const snapResumes = await getDocs(qResumes).catch(e => console.error("Resumes error:", e.message));
  if (snapResumes && !snapResumes.empty) console.log("Found in resumes!", snapResumes.docs[0].id);
  else console.log("Not found in resumes.");
  
  process.exit(0);
}

check();
