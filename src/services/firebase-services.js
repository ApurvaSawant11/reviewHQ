import { db } from "../config/firebase-config";
import { doc, collection, setDoc, addDoc } from "firebase/firestore";

const createUserDocument = async (userData) => {
  await setDoc(doc(db, "users", `${userData.uid}`), userData);
};

// add new post
const addNewPost = async (newPost) => {
  await addDoc(collection(db, "posts"), newPost);
};

export { createUserDocument, addNewPost };
