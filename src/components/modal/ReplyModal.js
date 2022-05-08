import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { addCommentReply } from "services/firebase-services";

const ReplyModal = ({ showModal, setShowModal, currentUserDetails }) => {
  const [newReply, setNewReply] = useState("");
  const { commentId, postId } = showModal;
  const replyHandler = () => {
    if (newReply.trim() !== "") {
      const replyDetails = {
        body: newReply,
        userName: currentUserDetails.userName,
        createdAt: new Date(),
      };
      addCommentReply(postId, commentId, replyDetails);
      setNewReply("");
      setShowModal({ status: false, commentId: null });
    } else {
      console.error("Reply field cannot be empty");
    }
  };
  return (
    <div
      className="fixed inset-0 bg-gray-200 bg-opacity-50 overflow-y-auto h-full w-full z-20"
      id="my-modal"
      onClick={() => setShowModal({ status: false, commentId: null })}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white h-fit"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <TextareaAutosize
          className="comment-textarea mt-4 w-full focus:outline-none resize-none border-b-2 p-2"
          minRows={1}
          maxRows={10}
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Add a reply..."
        />
        <button
          id="ok-btn"
          className="mt-2 p-1 px-2 bg-primary text-white rounded hover:bg-primaryDark "
          onClick={replyHandler}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export { ReplyModal };
