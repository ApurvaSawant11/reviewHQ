import { BookmarkOutlineIcon, HomeFillIcon, ProfileIcon } from "assets";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <aside className="bg-indigo-100 sticky top-[4.1rem] z-10">
      <ul className="flex justify-around">
        <Link to="/">
          <li className="p-4 flex items-center">
            <HomeFillIcon className="mr-2" size={18} />
            Home
          </li>
        </Link>
        <Link to="/bookmarks">
          <li className="p-4 flex items-center">
            <BookmarkOutlineIcon className="mr-2" /> Bookmarks
          </li>
        </Link>
        <Link to="/profile">
          <li className="p-4 flex items-center">
            <ProfileIcon className="mr-2" size={20} />
            Profile
          </li>
        </Link>
      </ul>
    </aside>
  );
};

export { Navbar };
