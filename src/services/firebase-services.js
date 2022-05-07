import { db } from "../config/firebase-config";
import { doc, setDoc } from "firebase/firestore";

const createUserDocument = async (userData) => {
  await setDoc(doc(db, "users", `${userData.uid}`), userData);
};

export { createUserDocument };
