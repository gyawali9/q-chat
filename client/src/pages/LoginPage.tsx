import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import type { LoginPayload, RegisterPayload } from "../types/auth";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext)!;

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    try {
      if (currentState === "Sign up") {
        const payload: RegisterPayload = {
          fullName,
          email,
          password,
          bio,
        };
        await login("signup", payload);

        // resetting the form fields
        setFullName("");
        setEmail("");
        setPassword("");
        setBio("");

        setIsDataSubmitted(false);
        setCurrentState("Login");
      } else {
        const payload: LoginPayload = {
          email,
          password,
        };
        await login("login", payload);
        setEmail("");
        setPassword("");

        navigate("/");
      }
    } catch (error) {
      console.log(error, "loginhandle error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left */}
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw, 250px)]" />

      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="arrow"
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currentState === "Sign up" && !isDataSubmitted && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}
        {currentState === "Sign up" && isDataSubmitted && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Provide a short bio..."
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?
              <span
                onClick={() => {
                  setCurrentState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an account?
              <span
                onClick={() => {
                  setCurrentState("Sign up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
