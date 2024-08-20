import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayRemove,
  collection,
  query,
  where,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

import { redirect } from './utils/utils.js';
import { handleLogout } from './auth.js';

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', handleLogout);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const blogList = document.querySelector('.blog-list');
    const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
    const querySnapshot = await getDocs(postsQuery);
    
    blogList.innerHTML = ''; // Clear existing content
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = createPostElement(doc.id, post);
      blogList.appendChild(postElement);
    });
  } else {
    redirect('login.html');
  }
});

function createPostElement(id, post) {
  const article = document.createElement('article');
  article.className = 'blog-post';
  article.innerHTML = `
    <img src="${
      post.imageUrl || 'https://placehold.co/150x150/FFF/FFF'
    }" alt="${post.title}">
    <div class="post-content">
      <h2>${post.title}</h2>
      <div class="post-meta">Created on ${post.createdAt
        .toDate()
        .toLocaleDateString()}</div>
      <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
      <a href="post-detail.html?id=${id}" class="read-more">Read More</a>
      <a href="edit-post.html?id=${id}" class="edit-post">Edit</a>
      <button class="delete-post" data-id="${id}">Delete</button>
    </div>
  `;

  const deleteButton = article.querySelector('.delete-post');
  deleteButton.addEventListener('click', () => deletePost(id));

  return article;
}

async function deletePost(postId) {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        posts: arrayRemove(postId)
      });
      console.log('Post deleted successfully');
      location.reload(); // Refresh the page to show updated list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
}