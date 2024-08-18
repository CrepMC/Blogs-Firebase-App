import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

// Handle Redirect
export const redirect = (target = 'index.html', time = 200) => {
  setTimeout(() => {
    window.location.href = target;
  }, time);
};

// Check logged or not
export const checkUserAuthentication = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log('User is not signed in, redecting to login...');
      redirect('login.html');
    } else {
      console.log('User is signed in');
    }
  });
};

// Handle show Image
export const handleImagePreview = (input, img) => {
  document.getElementById(input).addEventListener('change', (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const imgEl = document.getElementById(img);
        imgEl.src = event.target.result;
        imgEl.style.display = 'block';
      };
      reader.readAsDataURL(imageFile);
    }
  });
};

export const handleWarn = (warnText, confirmText) => {
  const warn = document.createElement('div')
  warn.className = 'handle-warn'
  warn.innerHTML = `
  <p>${warnText}</p>
  <button>${confirmText}</button>
  `
}