"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
  login as firebaseLogin,
  signInWithGoogle,
} from "../config/firebase.js";
import Link from "next/link.js";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailerror] = useState("");
  const [passwordError, setPassworderror] = useState("");
  const router = useRouter();

  const validateForm = () => {
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === "") {
      setEmailerror("Email is required");
      valid = false;
    } else if (!emailPattern.test(email)) {
      setEmailerror("Invalid email format");
      valid = false;
    } else {
      setEmailerror("");
    }
    if (password.trim() === "") {
      setPassworderror("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPassworderror("Password length should be 6");
      valid = false;
    } else {
      setPassworderror("");
    }
    return valid;
  };

  const loginUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await firebaseLogin(email, password);
      toast.success("Successfully logged in");
      setTimeout(() => {
        router.push("/Newsfeed");
      }, 1000);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const googleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithGoogle();
      if (result) {
        toast.success("Successfully logged in with Google");
        setTimeout(() => {
          router.push("/Newsfeed");
        }, 1000);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const resetPassword = async () => {
    try {
      await passwordReset(email);
      toast.success("Password reset link sent");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="flex justify-center">
              <img src="/log.png" className="w-16" alt="logo" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  <h2 className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center mb-8">
                    <span>Sign In</span>
                  </h2>
                </div>
                <form onSubmit={loginUser}>
                  <div className="mx-auto max-w-xs">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2">{emailError}</p>
                    )}
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <p className="text-red-500 text-sm mt-2">
                        {passwordError}
                      </p>
                    )}
                    <div className="flex justify-end mt-4">
                      <span
                        className="text-sm text-right font-medium text-blue-800 hover:underline dark:text-primary-500 hover:cursor-pointer"
                        onClick={resetPassword}
                      >
                        Forgot password?
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-green-400 text-white-500 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <svg
                        className="w-6 h-6 -ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="ml-4">Login</span>
                    </button>
                    <p className="text-center mt-2">or</p>
                    <button
                      onClick={googleLogin}
                      className="mt-2 tracking-wide font-semibold bg-green-400 text-white-500 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <FcGoogle size={20} />
                      {/* SVG for Google Icon */}
                      <span className="ml-4">Signin with Google</span>
                    </button>

                    <p className="mt-6 text-lg font-bold text-gray-600 text-center">
                      <Link href="/register">
                        <button
                          // onClick={() => router.push("/register")}
                          className="border-b border-gray-500 border-dotted"
                        >
                          Register
                        </button>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-green-100 text-center hidden lg:flex justify-center">
            <div
              className="m-6 xl:m-8 w-72 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/log.png')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
