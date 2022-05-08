import { ProfileCircleIcon, filledStarImg } from "assets";
import { PostCard } from "components";
import { useAuth, useData } from "context";
import React from "react";

const Profile = () => {
  const { currentUserDetails } = useAuth();
  const { firstName, lastName, userName, starsCount } = currentUserDetails;
  const { posts } = useData();
  const userPosts = posts.filter((post) => post.userName === userName);

  return (
    <section className="flex flex-col items-center mt-5">
      <ProfileCircleIcon size={64} />
      <div>
        <h2 className="font-bold text-3xl pt-4">
          {firstName} {lastName}
        </h2>
        <p className="text-center">@{userName}</p>
        <div className="flex justify-center items-center mt-4">
          <img src={filledStarImg} className="h-10" />
          <div className="text-4xl ml-2 mb-1">{starsCount}</div>
        </div>
      </div>

      <section className="mt-5 border-t-2 pt-4">
        <h2 className="text-xl font-bold text-center mb-9">
          <span className="border-b-4 border-indigo-700">Posts</span>
        </h2>

        {userPosts.map((post, index) => (
          <PostCard
            post={post}
            currentUserDetails={currentUserDetails}
            key={index}
          />
        ))}
      </section>
    </section>
  );
};

export { Profile };
