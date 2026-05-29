import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBodOkbG502cniXWKxK29qZuCYN2ztb4vo",
  authDomain: "virtuals2.firebaseapp.com",
  projectId: "virtuals2",
  storageBucket: "virtuals2.firebasestorage.app",
  messagingSenderId: "171287146583",
  appId: "1:171287146583:web:380661be04672e2b71f312"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export default app;
