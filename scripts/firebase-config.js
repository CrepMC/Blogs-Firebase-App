// Import các hàm cần thiết từ CDN: initializeApp, getAuth, getFirestore, getStorage
// Firebase Version: 10.12.5
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

// Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyBR4_xJZtCzlK_2OVr_jQhEKi7lhbu8vDk',
  authDomain: 'blogs-firebase-app.firebaseapp.com',
  projectId: 'blogs-firebase-app',
  storageBucket: 'blogs-firebase-app.appspot.com',
  messagingSenderId: '665882669518',
  appId: '1:665882669518:web:6fa5fce8fa6956be8efb9f',
};

// Khởi tạo ứng dụng, export auth, db, storage
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
