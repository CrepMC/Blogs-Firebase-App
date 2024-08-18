import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { checkUserAuthentication } from './utils/utils.js';
import { handleLogout } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  checkUserAuthentication();
  
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', handleLogout);

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (postId) {
    try {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        const postData = postDoc.data();
        displayPostDetails(postData);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  } else {
    console.log('No post ID provided');
  }
});

function displayPostDetails(post) {
  document.querySelector('.post-title').textContent = post.title;
  document.querySelector('.post-image').src = post.imageUrl;
  document.querySelector('.post-image').alt = post.title;
  document.querySelector('.post-meta').textContent = `By ${post.authorName} on ${post.createdAt.toDate().toLocaleDateString()}`;
  document.querySelector('.post-content').textContent = post.content;
}