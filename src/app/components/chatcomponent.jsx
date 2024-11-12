"use client";
import React, { useState, useEffect } from "react";
import { sendMessage, listenForMessages } from "../config/firebase"; // Import your Firebase functions

const ChatPopup = ({ friendName, closePopup, senderId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(senderId, receiverId, message);
      setMessage("");
    }
  };

  useEffect(() => {
    const unsubscribe = listenForMessages(
      senderId,
      receiverId,
      (newMessages) => {
        setMessages(newMessages);
      }
    );

    return () => unsubscribe();
  }, [senderId, receiverId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] h-[500px] rounded-lg p-4 flex flex-col">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold">{friendName}</h3>
          <button onClick={closePopup} className="text-red-500">
            X
          </button>
        </div>

        <div className="flex-grow overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex ${
                  msg.senderId === senderId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-2 my-2 rounded-lg ${
                    msg.senderId === senderId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 border rounded-lg"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
