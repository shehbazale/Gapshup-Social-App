// "use client";
// import { useRef, useState } from "react";
// import { CiVideoOn, CiCamera } from "react-icons/ci";
// import { BsEmojiSmile } from "react-icons/bs";
// import Image from "next/image";
// import { addPost } from "../config/firebase";
// import toast, { Toaster } from "react-hot-toast";

// const PostInput = () => {
//   const [post, setPost] = useState();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedImage({
//         file: file,
//         url: URL.createObjectURL(file),
//       });
//     }
//   };

//   const handlePhotoClick = () => {
//     fileInputRef.current.click();
//   };

//   const handlePost = async () => {
//     try {
//       const postData = { post, image: selectedImage.file };
//       await addPost(postData);
//       toast.success("Post successfully added");
//       console.log("Post added successfully");
//     } catch (e) {
//       console.log("Something went wrong", e);
//       toast.error(`Error: ${e.message}`);
//     }
//   };

//   return (
//     <>
//       <Toaster />
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <div className="flex items-center space-x-3 mb-4">
//           <Image
//             src="/contact/img1.jpeg"
//             alt="User"
//             width={40}
//             height={40}
//             className="rounded-full"
//           />
//           <input
//             type="text"
//             placeholder="What's happening?"
//             onChange={(e) => setPost(e.target.value)}
//             className="w-full bg-gray-100 p-2 rounded-full outline-none"
//           />
//         </div>

//         {selectedImage && (
//           <div className="mb-4">
//             <Image
//               src={selectedImage.url}
//               alt="Selected"
//               width={100}
//               height={100}
//               className="rounded-lg w-full"
//             />
//           </div>
//         )}

//         <div className="flex justify-between">
//           <div className="flex space-x-4 text-gray-500">
//             <button className="flex items-center space-x-1">
//               <CiVideoOn size={20} /> <span>Live video</span>
//             </button>
//             <button
//               onClick={handlePhotoClick}
//               className="flex items-center space-x-1"
//             >
//               <CiCamera size={20} /> <span>Photos</span>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </button>
//             <button className="flex items-center space-x-1">
//               <BsEmojiSmile />
//               <span> Feeling</span>
//             </button>
//           </div>
//           <button
//             className="bg-pink-500 text-white px-8 py-2 rounded-lg transition-all ease-in-out duration-500
//             hover:bg-pink-400"
//             onClick={handlePost}
//           >
//             Post
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PostInput;

"use client";
import { useRef, useState } from "react";
import { CiVideoOn, CiCamera } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import Image from "next/image";
import { addPost } from "../config/firebase";
import toast, { Toaster } from "react-hot-toast";

const PostInput = () => {
  const [post, setPost] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // state to manage loading
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage({
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePost = async () => {
    setLoading(true); // Start loading before posting
    try {
      const postData = { post, image: selectedImage?.file };
      await addPost(postData);
      toast.success("Post successfully added");
      console.log("Post added successfully");

      // Reset input fields after posting
      setPost("");
      setSelectedImage(null);
    } catch (e) {
      console.log("Something went wrong", e);
      toast.error(`Error: ${e.message}`);
    } finally {
      setLoading(false); // Stop loading after post action
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <Image
            src="/contact/img1.jpeg"
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setPost(e.target.value)}
            value={post}
            className="w-full bg-gray-100 p-2 rounded-full outline-none"
          />
        </div>

        {selectedImage && (
          <div className="mb-4">
            <Image
              src={selectedImage.url}
              alt="Selected"
              width={100}
              height={100}
              className="rounded-lg w-full"
            />
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex space-x-4 text-gray-500">
            <button className="flex items-center space-x-1">
              <CiVideoOn size={20} /> <span>Live video</span>
            </button>
            <button
              onClick={handlePhotoClick}
              className="flex items-center space-x-1"
            >
              <CiCamera size={20} /> <span>Photos</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </button>
            <button className="flex items-center space-x-1">
              <BsEmojiSmile />
              <span>Feeling</span>
            </button>
          </div>

          <button
            className="bg-pink-500 text-white px-8 py-2 rounded-lg transition-all ease-in-out duration-500 hover:bg-pink-400"
            onClick={handlePost}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Posting..." : "Post"}{" "}
            {/* Show loading text when posting */}
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="spinner-border text-pink-500" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PostInput;
