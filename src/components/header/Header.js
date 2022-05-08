import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/auth-context";
import { LeaderboardIcon } from "assets";

const Header = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <header className="flex px-5 py-3 border-b-2 border-indigo-700 bg-white sticky top-0 z-10">
      <section>
        <h1 className="font-bold text-3xl">
          review<span className="text-primary">HQ</span>
        </h1>
      </section>
      <section className="flex">
        <div
          className="flex items-center border-2 mr-4 px-4 rounded-md cursor-pointer"
          onClick={() => navigate("/leaderboard")}
        >
          <LeaderboardIcon size={24} className="text-indigo-700" />
          <span className="font-bold ml-2 leaderboard">Leaderboard</span>
        </div>
        {user ? (
          <button
            className="py-2 px-4 bg-primary text-white rounded hover:bg-primaryDark"
            onClick={logoutHandler}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="py-2 px-4 block bg-primary text-white rounded hover:bg-primaryDark"
          >
            Login
          </Link>
        )}
      </section>
    </header>
  );
};

export { Header };
