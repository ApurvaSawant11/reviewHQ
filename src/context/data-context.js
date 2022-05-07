import { createContext, useContext, useEffect, useReducer } from "react";
import { db } from "config/firebase-config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
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
    if (currentUserDetails) {
      onSnapshot(
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
    }
  }, [currentUserDetails]);

  const value = {
    posts: state.posts,
    dispatch,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

const useData = () => {
  return useContext(DataContext);
};

export { useData, DataProvider };
