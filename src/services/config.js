
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce63425.firebaseapp.com",
  projectId: "e-commerce63425",
  storageBucket: "e-commerce63425.firebasestorage.app",
  messagingSenderId: "741580099168",
  appId: "1:741580099168:web:19b436fb9ca8badf763d05"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
