import { db } from "../config/firebase-config";
import { doc, collection, setDoc, addDoc, updateDoc } from "firebase/firestore";

const createUserDocument = async (userData) => {
  await setDoc(doc(db, "users", `${userData.uid}`), userData);
};

// add new post
const addNewPost = async (newPost) => {
  await addDoc(collection(db, "posts"), newPost);
};

// add comment to a post
const addCommentToPost = async (postId, newComment) => {
  await addDoc(collection(db, "posts", `${postId}`, "comments"), newComment);
};

const updateCommentCount = async (postId, currentCommentsCount) => {
  await updateDoc(doc(db, "posts", `${postId}`), {
    commentsCount: currentCommentsCount + 1,
  });
};

export { createUserDocument, addNewPost, addCommentToPost, updateCommentCount };
