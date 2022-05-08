import {
  BookmarkOutlineIcon,
  ChatIcon,
  HomeFillIcon,
  ProfileIcon,
  SearchIcon,
} from "assets";
import { useAuth } from "context";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { currentUserDetails } = useAuth();
  return (
    <aside className="bg-indigo-100 sticky top-[4.1rem] z-10">
      <ul className="flex flex-wrap justify-around">
        <Link to="/">
          <li className="p-4 flex items-center">
            <HomeFillIcon className="mr-2" size={18} />
            <span className="nav-icons">Home</span>
          </li>
        </Link>
        <Link to="/bookmarks">
          <li className="p-4 flex items-center">
            <BookmarkOutlineIcon className="mr-2" />
            <span className="nav-icons">Bookmarks</span>
          </li>
        </Link>
        <Link to="/search">
          <li className="p-4 flex items-center">
            <SearchIcon className="mr-2" />
            <span className="nav-icons">Search</span>
          </li>
        </Link>
        <Link to={`/user/${currentUserDetails.uid}`}>
          <li className="p-4 flex items-center">
            <ProfileIcon className="mr-2" size={20} />
            <span className="nav-icons">Profile</span>
          </li>
        </Link>
        <Link to="/chats">
          <li className="p-4 flex items-center">
            <ChatIcon className="mr-2" size={20} />
            <span className="nav-icons">Chats</span>
          </li>
        </Link>
      </ul>
    </aside>
  );
};

export { Navbar };
