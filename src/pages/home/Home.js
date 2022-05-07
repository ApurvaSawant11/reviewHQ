import React from "react";
import { Link } from "react-router-dom";
import { NewPost, PostCard } from "components";

const Home = () => {
  console.log("HOME getting rendered");
  return (
    <main className="p-2 text-right">
      <div>
        <NewPost />
      </div>

      <div>
        <PostCard />
      </div>
    </main>
  );
};

export { Home };
