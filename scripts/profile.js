import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';
import { handleLogout } from './auth.js';
import { checkUserAuthentication } from './utils/utils.js';

// Ensure user is authenticated when the document is loaded
document.addEventListener('DOMContentLoaded', checkUserAuthentication);

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', handleLogout);
