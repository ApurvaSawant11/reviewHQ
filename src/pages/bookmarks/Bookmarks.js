import React, { useState, useEffect } from "react";
import { useAuth, useData } from "context";
import { PostCard } from "components";

const Bookmarks = () => {
  const { currentUserDetails } = useAuth();
  const { bookmarks } = useData();

  return (
    <section className="text-left flex flex-col items-center">
      <h1 className="uppercase font-bold text-3xl text-center my-5">
        Bookmarks
      </h1>
      {bookmarks?.map((bookmark, index) => (
        <PostCard
          post={bookmark}
          currentUserDetails={currentUserDetails}
          key={index}
        />
      ))}
    </section>
  );
};

export { Bookmarks };
