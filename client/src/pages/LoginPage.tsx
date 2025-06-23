import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import type { LoginPayload, RegisterPayload } from "../types/auth";
import SubmitButton from "../components/ui/SubmitButton";
import FormInput from "../components/ui/FormInput";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext)!;

  const onSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Function to disable the button
  const shouldDisableSubmit = () => {
    if (loading || !hasAgreed) return true;

    if (currentState === "Sign up") {
      if (!isDataSubmitted) return !(fullName && email && password);
      return !bio;
    }

    return !(email && password);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 md:justify-evenly max-md:flex-col backdrop-blur-2xl">
      {/* left */}
      <img
        src={assets.logo_big}
        alt="logo"
        className="
          h-auto
          w-[30vw]
          md:w-[30vw]
          lg:w-[min(30vw, 250px)
          object-contain
        "
      />

      {/* right */}
      <form
        autoComplete="off"
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg max-w-md w-full"
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
          <FormInput
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />

            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </>
        )}
        {currentState === "Sign up" && isDataSubmitted && (
          <FormInput
            type="textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Provide a short bio..."
            rows={4}
          />
        )}

        <SubmitButton
          text={currentState === "Sign up" ? "Create Account" : "Login Now"}
          loading={loading}
          disabled={shouldDisableSubmit()}
        />

        <FormInput
          type="checkbox"
          value={hasAgreed}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            setHasAgreed(target.checked);
          }}
          label={
            <p className="text-white">
              Agree to the terms of use & privacy policy.
            </p>
          }
        />

        <div className="flex flex-col gap-2">
          {currentState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?
              <span
                onClick={() => {
                  setCurrentState("Login");
                  setIsDataSubmitted(false);
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setHasAgreed(false);
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
                  setEmail("");
                  setPassword("");
                  setHasAgreed(false);
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
