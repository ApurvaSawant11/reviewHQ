import React, { useState } from "react";
import { useAuth } from "context";
import { addNewPost } from "services/firebase-services";
import TextareaAutosize from "react-textarea-autosize";

const NewPost = () => {
  const { currentUserDetails } = useAuth();
  const [newPost, setNewPost] = useState("");

  const addPostHandler = () => {
    const postDetails = {
      content: newPost,
      createdAt: new Date(),
      userName: currentUserDetails.userName,
      likesCount: 0,
      commentsCount: 0,
    };
    addNewPost(postDetails);
    setNewPost("");
  };

  return (
    <div className="text-center ">
      <TextareaAutosize
        className="mt-4 rounded-md border-2 border-gray-300 p-4 card-wrapper"
        minRows={3}
        maxRows={22}
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Write something awesome..."
      />

      <div className="">
        <button
          className="p-1 px-4 bg-primary text-white rounded hover:bg-primaryDark"
          onClick={addPostHandler}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export { NewPost };
