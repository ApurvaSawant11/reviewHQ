import React from "react";
import { Link } from "react-router-dom";
import { NewPost, PostCard } from "components";
import { useData, useAuth } from "context";

const Home = () => {
  const { posts } = useData();
  const { currentUserDetails } = useAuth();
  return (
    <main className="p-2 text-right">
      <NewPost />

      <section className="text-left flex flex-col items-center">
        {posts.map((post, index) => (
          <PostCard
            post={post}
            currentUserDetails={currentUserDetails}
            key={index}
          />
        ))}
      </section>
    </main>
  );
};

export { Home };
