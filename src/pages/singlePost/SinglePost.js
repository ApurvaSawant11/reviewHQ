import React, { useEffect, useState } from "react";
import { convertTimestampToDate } from "utils/convertDate";
import {
  BookmarkOutlineIcon,
  CommentIcon,
  DeleteIcon,
  filledStarImg,
  LikeOutlineIcon,
  BookmarkFillIcon,
  LikeFillIcon,
} from "assets";
import { outlinedStarImg } from "assets";
import {
  addCommentToPost,
  updateCommentCount,
  updateCommentStars,
  addPostToBookmarks,
  removePostToBookmarks,
  updateArrayOfPost,
  deletePost,
} from "services/firebase-services";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import { useAuth, useData } from "context";
import { db } from "config/firebase-config";
import TextareaAutosize from "react-textarea-autosize";

const SinglePost = () => {
  const { postId } = useParams();
  const { currentUserDetails } = useAuth();
  const { posts } = useData();
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const post = posts?.find((item) => item._id === postId);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (post) {
      const q = query(
        collection(db, "posts", `${post._id}`, "comments"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const comments = [];
        querySnapshot.forEach((doc) => {
          comments.push({ ...doc.data(), commentId: doc.id });
        });
        setPostComments(comments);
      });
      return () => {
        unsubscribe();
      };
    }
  }, [post]);

  const commentHandler = () => {
    const commentDetails = {
      body: newComment,
      postId: post._id,
      userName: currentUserDetails.userName,
      userId: currentUserDetails.uid,
      createdAt: new Date(),
      starsEarnedFrom: [],
    };
    addCommentToPost(post._id, commentDetails);
    updateCommentCount(post._id, post.commentsCount);
    setNewComment("");
    setShowButton(false);
  };
  return (
    <article className="text-left flex flex-col items-center">
      {post && (
        <>
          <section className="card-wrapper post-card rounded-md mt-5 border-2 border-gray-300 p-4 pb-3">
            <header className="flex justify-between">
              <h4 className="font-bold ">@{post.userName}</h4>
              {currentUserDetails?.userName === post.userName && (
                <DeleteIcon
                  className="delete-post-icon cursor-pointer text-red-600 invisible"
                  size={20}
                  onClick={(e) => {
                    deletePost(post._id, post.asset);
                  }}
                />
              )}
            </header>
            <p className="text-xs mt-1 pl-px">
              {convertTimestampToDate(post.createdAt)}
            </p>
            <div className="whitespace-pre-wrap mt-4">
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <SecureLink
                    className="text-indigo-700 "
                    href={decoratedHref}
                    key={key}
                  >
                    {decoratedText}
                  </SecureLink>
                )}
              >
                {post.content}
              </Linkify>
              {post.asset && (
                <div>
                  {post.asset.assetType === "video" ? (
                    <video
                      className="video m-auto rounded-md"
                      src={post.asset.assetUrl}
                      controls
                    />
                  ) : (
                    <a
                      href={post.asset.assetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img className="rounded-md" src={post.asset.assetUrl} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 mb-2 pt-2 border-t-2 border-gray-200">
              <div className="flex items-center">
                {post.likedByUsers.includes(currentUserDetails.userName) ? (
                  <LikeFillIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() =>
                      updateArrayOfPost(
                        postId,
                        currentUserDetails.userName,
                        "likedByUsers",
                        "remove"
                      )
                    }
                  />
                ) : (
                  <LikeOutlineIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() =>
                      updateArrayOfPost(
                        postId,
                        currentUserDetails.userName,
                        "likedByUsers",
                        "add"
                      )
                    }
                  />
                )}
                <span className="text-md ml-4">{post.likedByUsers.length}</span>
              </div>
              <div className="flex items-center">
                <CommentIcon className="cursor-pointer" size={18} />{" "}
                <span className="text-md ml-4">{post.commentsCount}</span>
              </div>
              {post.bookmarkedByUsers.includes(currentUserDetails.userName) ? (
                <BookmarkFillIcon
                  size={17}
                  onClick={() =>
                    removePostToBookmarks(currentUserDetails, post._id)
                  }
                />
              ) : (
                <BookmarkOutlineIcon
                  size={17}
                  onClick={() =>
                    addPostToBookmarks(currentUserDetails, post._id)
                  }
                />
              )}
            </div>
            {/* comment */}
            <div className="border-t-2 pt-2 mb-4">
              <TextareaAutosize
                className="comment-textarea mt-4 rounded-md w-full focus:outline-none resize-none"
                minRows={1}
                maxRows={10}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a review/comment"
                onClick={() => setShowButton(true)}
              />
              {showButton && (
                <button
                  className="mt-4 p-1 px-2 bg-primary text-white rounded hover:bg-primaryDark"
                  onClick={commentHandler}
                >
                  Comment
                </button>
              )}
            </div>

            {postComments?.map((comment, index) => {
              const { userName, starsEarnedFrom, body } = comment;
              return (
                <div className="post-card py-4 border-t-2 " key={index}>
                  <div className="flex justify-between">
                    <p className="text-xs font-bold">@{userName}</p>
                    <div className="flex items-center text-gray-500">
                      <span className="mr-2">{starsEarnedFrom.length}</span>
                      {starsEarnedFrom.includes(currentUserDetails.userName) ? (
                        <img
                          className={`h-6 ${
                            currentUserDetails.userName !== userName
                              ? "cursor-pointer"
                              : "pointer-events-none opacity-50"
                          }`}
                          src={filledStarImg}
                          onClick={() =>
                            updateCommentStars(
                              comment,
                              currentUserDetails.userName,
                              "remove"
                            )
                          }
                        />
                      ) : (
                        <img
                          className={`h-6 ${
                            currentUserDetails.userName !== userName
                              ? "cursor-pointer"
                              : "pointer-events-none opacity-50"
                          }`}
                          src={outlinedStarImg}
                          onClick={() =>
                            updateCommentStars(
                              comment,
                              currentUserDetails.userName,
                              "add"
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                  <p>{body}</p>
                </div>
              );
            })}
          </section>
        </>
      )}
    </article>
  );
};

export { SinglePost };
