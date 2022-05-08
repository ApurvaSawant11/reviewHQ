import { useAuth } from "context";
import React, { useState, useEffect } from "react";
import { db, storage } from "config/firebase-config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { ChatUser, ChatMessageForm, ChatMessage } from "components";
import { toast } from "react-toastify";

const Chats = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [msgs, setMsgs] = useState([]);

  const { currentUserDetails } = useAuth();
  const user1 = currentUserDetails.uid;

  useEffect(() => {
    if (currentUserDetails.uid) {
      let users = [];
      getDoc(doc(db, "users", `${currentUserDetails.uid}`))
        .then((docSnap) => {
          if (docSnap.exists()) {
            users = docSnap.data().myChatPartners;
          }
        })
        .then(() => {
          const q = query(collection(db, "users"), where("uid", "in", users));
          const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
              users.push(doc.data());
            });
            setUsers(users);
          });
          return () => unsub();
        });
    }
  }, [currentUserDetails]);

  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    const docSnap = await getDoc(doc(db, "lastMessage", id));
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, "lastMessage", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (image) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${image.name}`
      );
      toast.info("Upload in progress...", {
        autoClose: false,
        position: "top-right",
      });
      const snap = await uploadBytes(imgRef, image);
      const downloadUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = downloadUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "lastMessage", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    setText("");
    setImage("");
  };

  return (
    <div className="chatbox-container mt-2">
      <div className="max-w-xs">
        <h5 className="text-center border-b-2 pb-2">Messages from</h5>
        {users?.map((user) => (
          <ChatUser
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="w-full relative p-4 pb-0">
        {chat ? (
          <>
            <div className="messages">
              {msgs.length
                ? msgs.map((msg, i) => (
                    <ChatMessage key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </div>
            <ChatMessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImage={setImage}
            />
          </>
        ) : (
          <h3 className="font-bold text-center mt-4 text-lg">
            Select a user to start conversation OR search the user you want to
            talk to
          </h3>
        )}
      </div>
    </div>
  );
};

export { Chats };
