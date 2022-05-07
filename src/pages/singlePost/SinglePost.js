import React, { useEffect, useState } from "react";
import { convertTimestampToDate } from "utils/convertDate";
import {
  BookmarkOutlineIcon,
  CommentIcon,
  DeleteIcon,
  LikeOutlineIcon,
} from "assets";

import {
  addCommentToPost,
  updateCommentCount,
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
          comments.push(doc.data());
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
      createdAt: new Date(),
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
            </div>

            <div className="flex items-center justify-between mt-4 mb-3 pt-2 border-t-2 ">
              <div className="flex items-center">
                <LikeOutlineIcon className="cursor-pointer" size={20} />
                <span className="text-md ml-4">{post.likesCount}</span>
              </div>
              <div className="flex items-center">
                <CommentIcon className="cursor-pointer" size={18} />{" "}
                <span className="text-md ml-4">{post.commentsCount}</span>
              </div>
              <BookmarkOutlineIcon className="cursor-pointer" size={17} />
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

            {postComments?.map((comment, index) => (
              <div className="post-card py-4 border-t-2 " key={index}>
                <p className="text-xs font-bold">@{comment.userName}</p>
                <p>{comment.body}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </article>
  );
};

export { SinglePost };
