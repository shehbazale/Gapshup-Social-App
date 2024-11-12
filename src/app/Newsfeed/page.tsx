"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/sidebar";
import NewsFeed from "../components/newsfeed";
import ChatSidebar from "../components/rightSideBar";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, auth } from "../config/firebase";
import Loader from "../components/loader";
const NewsFeedPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isLogin = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user login");
        setLoading(false);
      } else {
        router.push("/");
      }
    });

    return () => isLogin();
  }, [router]);
  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="flex w-[98%] mx-auto justify-between relative ">
        <Sidebar />

        <NewsFeed />
        <ChatSidebar />
      </div>
    </>
  );
};

export default NewsFeedPage;
