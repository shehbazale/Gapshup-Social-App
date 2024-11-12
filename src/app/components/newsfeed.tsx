import React from "react";
import PostInput from "../components/postInput";
import PostCard from "../components/postCard";
import Sidebar from "../components/newsSide";
const NewsFeed = () => {
  return (
    <>
      <div className="bg-gray-100 h-screen flex justify-center  w-[60%] mx-[20%] overflow-hidden">
        <div className="container mx-auto flex p-4 gap-4 h-full">
          {/* Post section */}
          <div className="w-full md:w-2/3 space-y-4 h-full overflow-y-auto">
            <PostInput />
            <PostCard />
          </div>

          {/* Sidebar */}
          <div className="hidden md:block w-1/3 sticky top-0 h-screen overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsFeed;
