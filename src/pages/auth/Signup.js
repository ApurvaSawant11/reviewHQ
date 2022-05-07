import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context";
import { createUserDocument } from "services/firebase-services";

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const defaultFormValue = {
    email: "",
    password: "",
    confirmPwd: "",
    firstName: "",
    lastName: "",
    userName: "",
  };
  const [formData, setFormData] = useState(defaultFormValue);

  const signUpHandler = async (e) => {
    e.preventDefault();
    const { firstName, lastName, userName, password, confirmPwd } = formData;
    if (password === confirmPwd) {
      try {
        const { user } = await signUp(formData.email, formData.password);
        const userData = {
          firstName: firstName,
          lastName: lastName,
          userName: userName,
          uid: user.uid,
          starsCount: 0,
        };
        createUserDocument(userData);
        navigate("/", { replace: true });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fillFormValue = (event, fieldName) => {
    const regex = "^\\s+$";
    const { value } = event.target;
    if (!value.match(regex))
      setFormData((form) => ({ ...form, [fieldName]: value }));
  };

  return (
    <main className="h-screen wrapper flex justify-center items-start mt-[4rem] ">
      <form
        className="rounded-lg shadow-lg shadow-indigo-500/50 form-wrapper"
        onSubmit={signUpHandler}
      >
        <div className="bg-white p-5">
          <h4 className="font-bold uppercase text-center text-2xl mb-5">
            <span className="border-b-2 border-indigo-700">Sign up</span>
          </h4>
          <input
            className="p-2 rounded text-base w-full border border-black w-full my-3"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => fillFormValue(e, "firstName")}
            required
          />

          <input
            className="p-2 rounded text-base w-full border border-black w-full my-3"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => fillFormValue(e, "lastName")}
            required
          />

          <input
            className="p-2 rounded text-base w-full border border-black w-full my-3"
            type="text"
            placeholder="username"
            value={formData.userName}
            onChange={(e) => fillFormValue(e, "userName")}
            required
          />

          <input
            className="p-2 rounded text-base w-full border border-black w-full my-3"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => fillFormValue(e, "email")}
            required
          />

          <input
            className="p-2 rounded text-base w-full border border-black w-full my-3"
            type="password"
            placeholder="Password"
            onChange={(e) => fillFormValue(e, "password")}
            required
          />

          <input
            className="p-2 rounded text-base w-full border border-black w-full my-3"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPwd}
            onChange={(e) => fillFormValue(e, "confirmPwd")}
            required
          />
          <button
            type="submit"
            className=" my-5 py-2 px-2.5 bg-primary text-white rounded hover:bg-primaryDark w-full"
          >
            Signup
          </button>

          <p className="text-center mt-1">
            Already have an account? Login{" "}
            <Link
              className="text-sm text-opacity-100 text-center my-[2rem]"
              to="/login"
            >
              <span className="text-indigo-600 font-bold underline">here</span>
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
};

export { Signup };
