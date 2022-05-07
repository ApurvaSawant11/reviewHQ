import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/auth-context";

const Header = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  console.log(user);
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
      <section>
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
