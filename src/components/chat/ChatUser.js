import React, { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "config/firebase-config";

const ChatUser = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMessage", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <div
        className={`user_wrapper my-2 p-3 cursor-pointer rounded ${
          chat.userName === user.userName && "bg-indigo-100"
        }`}
        onClick={() => selectUser(user)}
      >
        <h4 className="font-bold">
          {user.firstName} {user.lastName}
        </h4>
        {data?.from !== user1 && data?.unread && (
          <small className="text-indigo-700 border-gray-300 rounded font-bold border-2 px-1 ">
            New
          </small>
        )}
        {data && (
          <p className="truncate">
            <strong className="">{data.from === user1 ? "You: " : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`${chat.userName === user.userName && "bg-indigo-100"}`}
      ></div>
    </div>
  );
};

export { ChatUser };
