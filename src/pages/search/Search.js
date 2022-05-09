import { PostCard } from "components";
import { useData, useAuth } from "context";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { filledStarImg } from "assets";

const Search = () => {
  const { currentUserDetails } = useAuth();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { posts, allUsers } = useData();

  let filteredPosts = [];
  let filteredUsers = [];
  if (searchText[0] === "@") {
    filteredUsers = allUsers.filter(
      (user) =>
        searchText.trim() !== "" && user.userName.includes(searchText.slice(1))
    );
  } else {
    filteredPosts = posts.filter(
      (post) =>
        searchText.trim() !== "" &&
        post.content.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  return (
    <div className="flex flex-col mt-5 items-center">
      <input
        type="text"
        className="border-2 border-gray-300 rounded-md bg-slate-200 card-wrapper p-1 pl-2"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search @username #hashtag or content..."
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

        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => navigate(`/user/${user.uid}`)}
            className="flex card-wrapper justify-between rounded-md my-5 border-2 border-gray-300 p-4 pb-3 cursor-pointer"
          >
            <div>
              <h2 className="font-bold text-xl">
                {user.firstName} {user.lastName}
              </h2>
              <p>@{user.userName}</p>
            </div>
            <div className="flex items-center">
              <img src={filledStarImg} className="h-5" />
              <div className="text-xl ml-2">{user.starsCount}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export { Search };
