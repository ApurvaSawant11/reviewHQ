import React, { useEffect, useState } from "react";
import { useAuth } from "context";
import {
  addNewPost,
  deleteAsset,
  uploadAsset,
} from "services/firebase-services";
import TextareaAutosize from "react-textarea-autosize";
import { CloseIcon, UploadIcon } from "assets";
const NewPost = () => {
  const { currentUserDetails } = useAuth();
  const [newPost, setNewPost] = useState("");
  const [currentAsset, setCurrentAsset] = useState(null);
  const [assetDetails, setAssetDetails] = useState(null);

  useEffect(() => {
    uploadAsset(currentAsset, setCurrentAsset, setAssetDetails);
  }, [currentAsset]);

  const addPostHandler = () => {
    const postDetails = {
      content: newPost,
      createdAt: new Date(),
      userName: currentUserDetails.userName,
      likedByUsers: [],
      bookmarkedByUsers: [],
      commentsCount: 0,
      asset: assetDetails,
    };
    addNewPost(postDetails);
    setNewPost("");
    setAssetDetails(null);
  };

  return (
    <div className="card-wrapper flex flex-col items-center m-auto">
      <TextareaAutosize
        className="mt-4 rounded-md border-2 border-gray-300 p-4 w-full"
        minRows={3}
        maxRows={22}
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Write something awesome..."
      />

      {assetDetails && (
        <div className="w-full mt-4 pt-4 relative">
          {assetDetails.assetType === "video" ? (
            <video
              className="video m-auto rounded-md"
              src={assetDetails.assetUrl}
              controls
            />
          ) : (
            <img
              className="w-5/6 m-auto rounded-md"
              src={assetDetails.assetUrl}
            />
          )}
          <CloseIcon
            className="absolute top-0 right-7 cursor-pointer"
            size={24}
            onClick={() =>
              deleteAsset(setCurrentAsset, assetDetails, setAssetDetails)
            }
          />
        </div>
      )}

      <div className="mt-1 flex justify-between gap-5 w-full px-4">
        <label className="upload-container relative overflow-hidden">
          <UploadIcon
            className="inline cursor-pointer text-indigo-700"
            size={26}
          />
          <input
            type="file"
            onChange={(e) => {
              setCurrentAsset(e.target.files[0]);
            }}
          />
        </label>
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
