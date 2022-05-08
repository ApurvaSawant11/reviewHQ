import { ProfileCircleIcon, filledStarImg } from "assets";
import { PostCard } from "components";
import { useAuth, useData } from "context";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "config/firebase-config";
import { addUserToMyChats } from "services/firebase-services";
const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    getDoc(doc(db, "users", `${userId}`)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  });

  const { currentUserDetails } = useAuth();
  const { posts } = useData();
  const userPosts = posts.filter((post) => post.userName === user?.userName);

  return (
    <>
      {user && (
        <section className="flex flex-col items-center mt-5">
          <ProfileCircleIcon size={64} />
          <div>
            <h2 className="font-bold text-3xl pt-4">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-center">@{user.userName}</p>
            <div className="flex justify-center items-center mt-4">
              <img src={filledStarImg} className="h-10" />
              <div className="text-4xl ml-2 mb-1">{user.starsCount}</div>
            </div>
          </div>

          {currentUserDetails.uid !== user.uid && (
            <button
              className=" my-4 py-2 px-4 bg-primary text-white rounded hover:bg-primaryDark"
              onClick={() => {
                addUserToMyChats(currentUserDetails.uid, user.uid);
                navigate("/chats");
              }}
            >
              Message {user.firstName}
            </button>
          )}

          <section className="mt-5 border-t-2 pt-4">
            <h2 className="text-xl font-bold text-center mb-9">
              <span className="border-b-4 border-indigo-700">Posts</span>
            </h2>

            {userPosts.map((post, index) => (
              <PostCard post={post} currentUserDetails={user} key={index} />
            ))}
          </section>
        </section>
      )}
    </>
  );
};

export { Profile };
