import React, { useRef, useEffect } from "react";
import { convertTimestampToDate } from "utils/convertDate";

const ChatMessage = ({ msg, user1 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
    <div
      className={`message-wrapper mt-[3px] ${
        msg.from === user1 ? "text-right" : ""
      }`}
      ref={scrollRef}
    >
      <p
        className={
          msg.from === user1 ? "bg-primary text-white" : "bg-indigo-100"
        }
      >
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br />
        <small>{convertTimestampToDate(msg.createdAt)}</small>
      </p>
    </div>
  );
};

export { ChatMessage };
