import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCrP8FoMasnY3dx-XX1YAnwtV6TPG1uk1I",
    authDomain: "tickets-4bac0.firebaseapp.com",
    projectId: "tickets-4bac0",
    storageBucket: "tickets-4bac0.appspot.com",
    messagingSenderId: "605357683631",
    appId: "1:605357683631:web:2a301e470c01de75bef55a",
    measurementId: "G-E09R6LLZ38"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };