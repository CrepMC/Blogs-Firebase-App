import { db, storage } from './firebase-config.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { ref, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

import { checkUserAuthentication, handleImagePreview } from './utils/utils.js';
import { handleLogout } from './auth.js';

document.addEventListener('DOMContentLoaded', checkUserAuthentication);

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', handleLogout);

// Thực hiện chức năng edit post cho edit-post.html
