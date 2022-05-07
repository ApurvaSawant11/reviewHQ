import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/auth-context";
const Login = () => {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await logIn(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const guestLoginHandler = (e) => {
    setFormData((form) => ({
      ...form,
      email: "apurvasawant@gmail.com",
      password: "apurva123",
    }));
  };

  return (
    <main className="h-screen wrapper flex justify-center items-start mt-[4rem] ">
      <form
        onSubmit={loginHandler}
        className="rounded-lg shadow-lg shadow-indigo-500/50 w-3/12"
      >
        <div className="bg-white form-wrapper p-5">
          <h4 className="font-bold uppercase text-center text-2xl">
            <span className="border-b-2 border-indigo-700">Login</span>
          </h4>
          <div className="w-full my-5">
            <input
              className="p-2 rounded text-base w-full border border-black"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((form) => ({ ...form, email: e.target.value }))
              }
            />
          </div>
          <div className="w-full my-5">
            <input
              type="password"
              placeholder="Password"
              className="p-2 rounded text-base w-full border border-black"
              value={formData.password}
              onChange={(e) =>
                setFormData((form) => ({ ...form, password: e.target.value }))
              }
            />
          </div>

          <button
            type="submit"
            className=" my-5 py-2 px-2.5 bg-primary text-white rounded hover:bg-primaryDark w-full"
          >
            Log In
          </button>
          <button
            type="submit"
            className="py-2 px-2.5 border-2 border-indigo-700 outline-none text-black rounded hover:bg-primary hover:text-white w-full"
            onClick={guestLoginHandler}
          >
            Use Guest Credentials
          </button>
          <Link
            to="/signup"
            className="text-sm text-opacity-100 text-center my-[2rem] hover:text-indigo-600 hover:font-bold underline block"
          >
            Create Account
          </Link>
        </div>
      </form>
    </main>
  );
};

export { Login };
