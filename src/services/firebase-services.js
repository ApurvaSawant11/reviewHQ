import { db, storage } from "../config/firebase-config";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
  deleteField,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuid } from "uuid";

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

// update comment count of a post
const updateCommentCount = async (postId, currentCommentsCount) => {
  await updateDoc(doc(db, "posts", `${postId}`), {
    commentsCount: currentCommentsCount + 1,
  });
};

// delete user's post
const deletePost = async (postId, assetDetails) => {
  if (assetDetails) {
    const assetRef = ref(storage, `${assetDetails.assetStoragePath}`);
    deleteObject(assetRef);
  }
  await deleteDoc(doc(db, "posts", `${postId}`));
};

// Add asset to the post
const uploadAsset = (currentAsset, setCurrentAsset, setAssetDetails) => {
  if (currentAsset === null) return;
  const assetName = uuid();
  const currentAssetType = currentAsset.type.includes("image")
    ? "image"
    : "video";

  const uploadTask = uploadBytesResumable(
    ref(storage, `${currentAssetType}s/${assetName}`),
    currentAsset
  );

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setAssetDetails({
          assetType: currentAssetType,
          assetUrl: downloadURL,
          assetStoragePath: `${currentAssetType}s/${assetName}`,
        });
        setCurrentAsset(null);
      });
    }
  );
};

// delete asset from the post

const deleteAsset = (setCurrentAsset, assetDetails, setAssetDetails) => {
  const assetRef = ref(storage, `${assetDetails.assetStoragePath}`);

  deleteObject(assetRef)
    .then(() => {
      console.log("file deleted successfully");
      setAssetDetails(null);
      setCurrentAsset(null);
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
    });
};

// update comment's star (points)
const updateCommentStars = async (
  { postId, commentId, userId },
  currentUserName,
  actionType
) => {
  await updateDoc(doc(db, "posts", `${postId}`, "comments", `${commentId}`), {
    starsEarnedFrom:
      actionType === "add"
        ? arrayUnion(currentUserName)
        : arrayRemove(currentUserName),
  });
  updateUserStars(userId, actionType);
};

// update user's star (points)
const updateUserStars = async (userId, actionType) => {
  await updateDoc(doc(db, "users", `${userId}`), {
    starsCount: actionType === "add" ? increment(1) : increment(-1),
  });
};

// add post to user's bookmarks
const addPostToBookmarks = async ({ uid, userName }, postId) => {
  updateArrayOfPost(postId, userName, "bookmarkedByUsers", "add");
  const docRef = doc(db, "posts", `${postId}`);
  await setDoc(
    doc(db, "users", `${uid}`),
    {
      bookmarkRefs: { [postId]: docRef },
    },
    { merge: true }
  );
};

// remove post to user's bookmarks
const removePostToBookmarks = async ({ uid, userName }, postId) => {
  updateArrayOfPost(postId, userName, "bookmarkedByUsers", "remove");
  await updateDoc(doc(db, "users", `${uid}`), {
    [`bookmarkRefs.${postId}`]: deleteField(),
  });
};

// update array content of the post
const updateArrayOfPost = async (
  postId,
  currentUserName,
  arrayName,
  actionType
) => {
  await updateDoc(doc(db, "posts", `${postId}`), {
    [arrayName]:
      actionType === "add"
        ? arrayUnion(currentUserName)
        : arrayRemove(currentUserName),
  });
};
export {
  createUserDocument,
  addNewPost,
  addCommentToPost,
  updateCommentCount,
  deletePost,
  uploadAsset,
  deleteAsset,
  updateCommentStars,
  updateUserStars,
  addPostToBookmarks,
  removePostToBookmarks,
  updateArrayOfPost,
};
