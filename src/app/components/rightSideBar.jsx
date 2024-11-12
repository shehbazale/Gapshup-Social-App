import React, { useState, useEffect } from "react";
import { MdOutlineMessage } from "react-icons/md";
import { fetchAcceptedFriends } from "../config/firebase";
import ChatPopup from "../components/chatcomponent";
import { auth } from "../config/firebase";

const ChatSidebar = () => {
  const [friends, setFriends] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeFriend, setActiveFriend] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [senderId, setSenderId] = useState("");

  useEffect(() => {
    const result = auth.onAuthStateChanged((user) => {
      if (user) {
        setSenderId(user.uid);

        const unsubscribeFriends = fetchAcceptedFriends(setFriends);

        return () => {
          unsubscribeFriends();
        };
      } else {
        setSenderId(null);
        setFriends([]);
      }
    });

    return () => result();
  }, []);

  const openChat = (friendName, friendId) => {
    setActiveFriend(friendName);
    setReceiverId(friendId);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setActiveFriend("");
    setReceiverId("");
  };

  const stories = [
    { name: "Add", img: "/contact/img1.jpeg" },
    { name: "Emilia", img: "/contact/img2.jpg" },
    { name: "John", img: "/contact/img6.jpg" },
    { name: "George", img: "/contact/img7.jpeg" },
  ];

  return (
    <div className="p-4 w-[20%] bg-white border-r border-gray-200 absolute min-h-screen overflow-y-auto right-0 top-0">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Stories"
          className="w-full px-4 py-2 border rounded-lg border-gray-300"
        />
      </div>

      <div className="flex mb-6 space-x-4 overflow-x-auto">
        {stories.map((story, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-pink-500 overflow-hidden">
              <img
                src={story.img}
                alt={story.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm mt-1 text-center">{story.name}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">Recent Chats</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/contact/img1.jpeg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{friend.name}</p>
                </div>
              </div>
              <button
                onClick={() => openChat(friend.name, friend.id)}
                className="text-blue-500"
              >
                <MdOutlineMessage size={20} />
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center">No friends yet</p>
        )}
      </ul>

      {isChatOpen && senderId && (
        <ChatPopup
          friendName={activeFriend}
          receiverId={receiverId}
          senderId={senderId}
          closePopup={closeChat}
        />
      )}
    </div>
  );
};

export default ChatSidebar;
