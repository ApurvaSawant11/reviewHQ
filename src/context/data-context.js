import { createContext, useContext, useEffect, useReducer } from "react";
import { db } from "config/firebase-config";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import { useAuth } from "./auth-context";
import { dataReducer, initialReducerData } from "reducer/dataReducer";

const DataContext = createContext({
  state: initialReducerData,
  dispatch: () => {},
});

const DataProvider = ({ children }) => {
  const { currentUserDetails } = useAuth();
  const [state, dispatch] = useReducer(dataReducer, initialReducerData);

  useEffect(() => {
    if (currentUserDetails.uid) {
      // To get the posts ofall the users
      const unsub = onSnapshot(
        query(collection(db, "posts"), orderBy("createdAt", "desc")),
        (snapshot) => {
          dispatch({
            type: "INITIALIZE_POSTS",
            payload: snapshot.docs.map((doc) => ({
              ...doc.data(),
              _id: doc.id,
            })),
          });
        }
      );

      // To get all thebookmarks of the user
      const unsubscribe = onSnapshot(
        query(
          collection(db, "posts"),
          where(
            "bookmarkedByUsers",
            "array-contains",
            `${currentUserDetails.userName}`
          )
        ),
        (snapshot) => {
          dispatch({
            type: "SET_BOOKMARKS",
            payload: snapshot.docs.map((doc) => ({
              ...doc.data(),
              _id: doc.id,
            })),
          });
        }
      );

      return () => {
        unsub();
        unsubscribe();
      };
    }
  }, [currentUserDetails]);

  const value = {
    posts: state.posts,
    bookmarks: state.bookmarks,
    dispatch,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useData = () => {
  return useContext(DataContext);
};

export { useData, DataProvider };
