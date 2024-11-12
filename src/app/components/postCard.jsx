"use client";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentAlt, FaRegShareSquare } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { getPosts, getUserById } from "../config/firebase";
import { formatDistanceToNow } from "date-fns";

const PostCard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const output = getPosts((postsData) => {
      const postsWithUserData = postsData.map(async (post) => {
        const userData = await getUserById(post.userId);
        const timeAgo = post.timestamp
          ? formatDistanceToNow(new Date(post.timestamp.seconds * 1000), {
              addSuffix: true,
            })
          : "Unknown time";

        return {
          ...post,
          userName: userData ? userData.fullname : "User",
          timeAgo,
        };
      });

      Promise.all(postsWithUserData).then((updatedPosts) => {
        setPosts(updatedPosts);
      });
    });

    return () => {
      output();
    };
  }, []);

  return (
    <>
      {posts.map((post) => (
        <div className="bg-white rounded-lg shadow-md p-4" key={post.id}>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src="/contact/img3.jpeg"
                alt="User"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            <div className="ml-3">
              <p className="font-bold">{post.userName || "User"}</p>
              <p className="text-xs">{post.timeAgo}</p>
            </div>
          </div>

          <p className="mb-2">{post.post}</p>
          <img
            src={post.image}
            alt={post.post}
            width={200}
            height={40}
            className="w-full rounded-lg"
          />

          <div className="flex justify-between items-center mt-3 text-gray-500">
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2">
                <CiHeart size={25} />
                <span> Like</span>
              </button>
              <button className="flex items-center space-x-2">
                <FaRegCommentAlt /> <span>Comments</span>
              </button>
              <button className="flex space-x-2">
                <FaRegShareSquare />
                <span>Share</span>
              </button>
            </div>
            <p className="text-sm">340 Likes</p>
          </div>

          <div className="flex items-center mt-4">
            <img
              src="/contact/img1.jpeg"
              alt="User"
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full bg-gray-100 p-2 rounded-full mr-2"
            />
            <span className="w-10 h-8 bg-pink-200 rounded-lg flex justify-center items-center">
              <IoSend className="text-pink-600" />
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default PostCard;
