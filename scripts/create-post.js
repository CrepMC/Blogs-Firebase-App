import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  arrayUnion,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';

import { handleImagePreview, redirect } from './utils/utils.js';
import { handleLogout } from './auth.js';

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', handleLogout);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const createPost = async (postForm) => {
      postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = postForm.title.value;
        const content = postForm.content.value;
        const image = postForm.image.files[0];
        
        try {
          let imageUrl = null;
          if (image) {
            const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
            const snapshot = await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(snapshot.ref);
          }

          const newPost = {
            title,
            content,
            imageUrl, // Lưu URL của ảnh thay vì đối tượng File
            authorId: user.uid,
            authorName: user.displayName || 'anonymousUser',
            createdAt: new Date(),
          }

          const postRef = await addDoc(collection(db, 'posts'), newPost);
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            posts: arrayUnion(postRef.id),
          });

          console.log('Post created successfully!');
          redirect('dashboard.html');
          
        } catch (err) {
          console.error('Error creating post:', err.message);
        }
      });
    };
    createPost(document.getElementById('createPostForm'));
  }
});