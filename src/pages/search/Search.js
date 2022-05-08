import { PostCard } from "components";
import { useData, useAuth } from "context";
import React, { useState } from "react";

const Search = () => {
  const { currentUserDetails } = useAuth();
  const [searchText, setSearchText] = useState("");

  const { posts } = useData();

  const filteredPosts = posts.filter(
    (post) =>
      searchText.trim() !== "" &&
      post.content.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col mt-5 items-center">
      <input
        type="text"
        className="border-2 border-gray-300 rounded-md bg-slate-200 card-wrapper p-1 pl-2"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search posts by #hashtags or content"
        onKeyDown={(e) => e.key === "Enter" && setSearchText("")}
      />
      <section>
        {filteredPosts.map((post, index) => (
          <PostCard
            post={post}
            currentUserDetails={currentUserDetails}
            key={index}
          />
        ))}
      </section>
    </div>
  );
};

export { Search };
