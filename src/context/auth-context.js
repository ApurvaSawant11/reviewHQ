import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "config/firebase-config";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [currentUserDetails, setCurrentUserDetails] = useState({});

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  function logOut() {
    return signOut(auth);
  }

  // get currentUser details
  const getCurrentUserDetails = async (userId) => {
    const docRef = doc(db, "users", `${userId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentUserDetails(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.error("No such user found!");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser) {
        setUser(currentuser);
        getCurrentUserDetails(currentuser.uid);
      } else {
        setUser(currentuser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUserDetails,
        logIn,
        signUp,
        logOut,
        getCurrentUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };
