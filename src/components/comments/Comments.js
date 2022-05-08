import React, { useEffect, useState } from "react";
import {
  addCommentToPost,
  updateCommentCount,
  updateCommentStars,
} from "services/firebase-services";
import { filledStarImg, outlinedStarImg, ReplyIcon } from "assets";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "config/firebase-config";
import TextareaAutosize from "react-textarea-autosize";
import { ReplyModal } from "components/modal/ReplyModal";
import { convertTimestampToDate } from "utils/convertDate";
import { LinkifyContent } from "components/LinkifyContent";
import { toast } from "react-toastify";

const Comments = ({ post, currentUserDetails }) => {
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [showModal, setShowModal] = useState({
    status: false,
    postId: null,
    commentId: null,
  });
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
    if (newComment.trim() !== "") {
      const commentDetails = {
        body: newComment,
        postId: post._id,
        userName: currentUserDetails.userName,
        userId: currentUserDetails.uid,
        createdAt: new Date(),
        starsEarnedFrom: [],
        replies: [],
      };
      addCommentToPost(post._id, commentDetails);
      updateCommentCount(post._id);
      setNewComment("");
      setShowButton(false);
    } else {
      console.log("gere");
      toast.error("Comment cannot be empty");
    }
  };

  return (
    <>
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
        const { userName, starsEarnedFrom, body, replies, createdAt } = comment;
        return (
          <div className="post-card py-4 border-t-2" key={index}>
            <div className="flex justify-between">
              <div className="text-xs flex">
                <p className="font-bold">@{userName}</p>
                <span className="pl-2">
                  {convertTimestampToDate(createdAt)}
                </span>
              </div>
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
            <LinkifyContent content={body} />
            <div className="flex py-3">
              <ReplyIcon
                size={20}
                className="mr-1"
                onClick={() =>
                  setShowModal({
                    status: true,
                    postId: comment.postId,
                    commentId: comment.commentId,
                  })
                }
              />
              <span>{replies.length}</span>
            </div>
            {replies.map((reply, index) => (
              <div key={index} className="ml-4 p-3">
                <div className="text-xs flex">
                  <p className="font-bold">@{reply.userName}</p>
                  <span className="pl-2">
                    {convertTimestampToDate(reply.createdAt)}
                  </span>
                </div>
                <LinkifyContent content={reply.body} />
              </div>
            ))}
          </div>
        );
      })}
      {showModal.status && (
        <ReplyModal
          showModal={showModal}
          setShowModal={setShowModal}
          currentUserDetails={currentUserDetails}
        />
      )}
    </>
  );
};

export { Comments };
