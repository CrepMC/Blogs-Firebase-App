import { checkUserAuthentication } from './utils/utils.js';
import { handleLogout } from './auth.js';
import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { db } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', checkUserAuthentication);

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', handleLogout);

// Hiển thị tất cả các bài viết trong collection "posts" (cho trang index.html):
const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user);
    
    // Fetch and display posts
    const blogList = document.querySelector('.blog-list');
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
    const postSnapshot = await getDocs(postsQuery);
    
    postSnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = createPostElement(doc.id, post);
      blogList.appendChild(postElement);
    });
  } else {
    console.log('User is signed out');
  }
});

const createPostElement = (id, post) => {
  const article = document.createElement('article');
  article.className = 'blog-post';
  article.innerHTML = `
    <img src="${post.imageUrl || 'placeholder-image-url.jpg'}" alt="${post.title}">
    <div class="post-content">
      <h2>${post.title}</h2>
      <div class="post-meta">By ${post.authorName} on ${post.createdAt.toDate().toLocaleDateString()}</div>
      <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
      <a href="post-detail.html?id=${id}" class="read-more">Read More</a>
    </div>
  `;
  return article;
}