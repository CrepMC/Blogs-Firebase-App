// Import auth và các hàm cần thiết
import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

import { redirect } from './utils/utils.js';

// Hàm tạo đối tượng initUser khi người dùng đăng ký mới

const initUser = (user) => {
  return {
    name: user.displayName || 'User',
    email: user.email,
    profilePicture: user.photoURL || '',
    uid: user.uid,
    bio: '', //tiểu sử
    createdAt: new Date(),
    updatedAt: new Date(),
    role: 'user',
    posts: [],
  };
};

// Viết hàm xử lý đăng nhậ<p></p>
const handleLoginWithEmailAndPassword = (loginForm) => {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const userData = initUser(user);
      const userRef = doc(db, 'users', user.uid);
      await getDoc(userRef, userData);
      console.log('Login Success!');
      redirect();
    } catch (error) {
      console.error('Login Error:', error.message);
    }
  });
};

// Viết hàm xử lý đăng ký tài khoản (bằng email-password)
const handleSignupWithEmailAndPassword = (signupForm) => {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const confirmPassword = signupForm['confirm-password'].value;
    if (confirmPassword === password) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const userData = initUser(user);
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, userData);
        console.log('Signup Success!');
        // redirect();
      } catch (e) {
        console.error('Signup Error:', e.message);
      }
    } else {
      console.log('Password does not match!');
    }
  });
};

// Viết hàm đăng nhập bằng Google, Github
const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user
    const userData = initUser(user);
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, userData);

    console.log('Login with Google Success!');
    redirect();
  } catch (e) {
    console.log('Google Login Fail. Error:', e.message);
  }
};

const handleGithubLogin = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    console.log('Login with Github Success!');
    redirect();
  } catch (e) {
    console.log('Github Login Fail. Error:', e.message);
  }
};

// Viết hàm xử lý đăng xuất
export const handleLogout = () => {
  signOut(auth)
    .then(() => {
      console.log('Logout Success!');
      redirect();
    })
    .catch((e) => {
      console.log('Logout Error:', e.message);
    });
};

// Xử lý với DOM
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const googleButton = document.getElementById('googleLogin');
const githubButton = document.getElementById('githubLogin');

if (loginForm) handleLoginWithEmailAndPassword(loginForm);
if (signupForm) handleSignupWithEmailAndPassword(signupForm);
if (googleButton) googleButton.addEventListener('click', handleGoogleLogin);
if (githubButton) githubButton.addEventListener('click', handleGithubLogin);
