"use client";
import React, { useEffect, useState } from "react";
import { fetchSuggestions, sendFriendRequest } from "../config/firebase";
import FriendRequest from "../components/friendRequest";

const Sidebar = () => {
  const events = [
    {
      title: "Design Talks",
      description: "A talk with Sr Designer",
      time: "12:30 PM IST",
    },
  ];

  const groups = [{ name: "Design Talks" }];

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getSuggestions = async () => {
      const users = await fetchSuggestions();
      setSuggestions(users);
    };

    getSuggestions();
  }, []);

  const handleAddFriend = async (recipientId) => {
    await sendFriendRequest(recipientId);
    setSuggestions((prevSuggestions) =>
      prevSuggestions.map((user) =>
        user.id === recipientId ? { ...user, requestSent: true } : user
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold mb-3">You might like</h3>
        {suggestions.map((suggestion, index) => (
          <div className="flex flex-col mt-4" key={index}>
            <div className="flex items-center space-x-2 mb-2 pt-2 border-t">
              <img src="/contact/img8.jpg" className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <p className="font-bold">{suggestion.fullname}</p>
                <p className="text-sm text-gray-500">Recently Active</p>
              </div>
            </div>
            <div className="flex justify-between">
              {suggestion.requestSent ? (
                <button
                  className="text-gray-500 w-24 border border-gray-300 rounded-lg py-2 text-sm"
                  disabled
                >
                  Request Sent
                </button>
              ) : (
                <button
                  className="text-white w-24 py-2 bg-pink-500 rounded-lg text-sm"
                  onClick={() => handleAddFriend(suggestion.id)}
                >
                  Add
                </button>
              )}
              <button className="text-gray-500 w-24 border border-pink-500 rounded-lg py-2 text-sm">
                Ignore
              </button>
            </div>
          </div>
        ))}
      </div>

      <FriendRequest />

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold mb-3">Upcoming Events</h3>
        {events.map((event, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-lg mb-2">
            <p className="font-bold">{event.title}</p>
            <p className="text-sm text-gray-500">{event.description}</p>
            <p className="text-xs text-gray-400">{event.time}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="font-bold mb-3">Suggested Groups</h3>
        {groups.map((group, index) => (
          <div key={index} className="flex items-center mb-2">
            <p className="text-sm">{group.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
