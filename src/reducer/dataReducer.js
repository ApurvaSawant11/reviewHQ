const initialReducerData = {
  posts: [],
  bookmarks: [],
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_POSTS":
      return {
        ...state,
        posts: action.payload,
      };

    case "SET_BOOKMARKS":
      return {
        ...state,
        bookmarks: action.payload,
      };
    default:
      throw new Error("Error in Data Reducer");
  }
};

export { initialReducerData, dataReducer };
