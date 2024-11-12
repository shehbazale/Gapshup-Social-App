// import React, { useEffect, useState } from "react";
// import {
//   fetchFriendRequests,
//   acceptFriendRequest,
//   handleCancel,
// } from "../config/firebase";
// // import { acceptFriendRequest } from "../config/firebase";
// const FriendRequest = () => {
//   const [friendRequests, setFriendRequests] = useState([]);

//   useEffect(() => {
//     const getFriendRequests = async () => {
//       const requests = await fetchFriendRequests();
//       console.log("friend request list==>", requests);
//       setFriendRequests(requests);
//     };

//     getFriendRequests();
//   }, []);

//   //   ************************ function to handle friend request ****************************
//   const acceptRequest = async (friendRequestId, senderId, recipientId) => {
//     await acceptFriendRequest(friendRequestId, senderId, recipientId);
//     setFriendRequests((prevRequests) =>
//       prevRequests.filter((request) => request.id !== friendRequestId)
//     );
//   };
//   //    ******************************** function to cancel request ********************

//   const cancelRequest = async (friendRequestId) => {
//     const success = await handleCancel(friendRequestId);
//     if (success) {
//       setFriendRequests((prevRequests) =>
//         prevRequests.filter((request) => request.id !== friendRequestId)
//       );
//     }
//   };
//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h3 className="font-bold mb-3">Friend Requests</h3>
//       {friendRequests.length > 0 ? (
//         friendRequests.map((request, index) => (
//           <div className="flex flex-col mt-4" key={request.id}>
//             <div
//               className={`flex items-center space-x-2 mb-2 pt-2 ${
//                 index !== 0 ? "border-t" : ""
//               }`}
//             >
//               <img
//                 src="/contact/img8.jpg"
//                 alt={request.senderName}
//                 className="w-12 h-12 rounded-full"
//               />
//               <div className="flex-1">
//                 <p className="font-bold">{request.senderName}</p>
//                 <p className="text-sm text-gray-500">{request.time}</p>
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <button
//                 className="text-white w-24 py-2 bg-pink-500 rounded-lg text-sm transition-all ease-in-out duration-500 hover:scale-105"
//                 onClick={() =>
//                   acceptRequest(
//                     request.id,
//                     request.senderId,
//                     request.recipientId
//                   )
//                 }
//               >
//                 Accept
//               </button>
//               <button
//                 className="text-gray-500 w-24 border border-pink-500 rounded-lg py-2 text-sm transition-all ease-in-out duration-500 hover:scale-105 "
//                 onClick={() => cancelRequest(request.id)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="text-gray-500 text-center">No friend requests</p>
//       )}
//     </div>
//   );
// };

// export default FriendRequest;

import React, { useEffect, useState } from "react";
import {
  fetchFriendRequests,
  acceptFriendRequest,
  handleCancel,
} from "../config/firebase";

const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // Pass a callback function to update `friendRequests` state in real-time
    const unsubscribe = fetchFriendRequests((requests) => {
      console.log("Updated friend requests==>", requests);
      setFriendRequests(requests);
    });

    // Cleanup listener on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle accepting friend requests
  const acceptRequest = async (friendRequestId, senderId, recipientId) => {
    await acceptFriendRequest(friendRequestId, senderId, recipientId);
    setFriendRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== friendRequestId)
    );
  };

  // Handle canceling friend requests
  const cancelRequest = async (friendRequestId) => {
    const success = await handleCancel(friendRequestId);
    if (success) {
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== friendRequestId)
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold mb-3">Friend Requests</h3>
      {friendRequests.length > 0 ? (
        friendRequests.map((request, index) => (
          <div className="flex flex-col mt-4" key={request.id}>
            <div
              className={`flex items-center space-x-2 mb-2 pt-2 ${
                index !== 0 ? "border-t" : ""
              }`}
            >
              <img
                src="/contact/img8.jpg"
                alt={request.senderName}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <p className="font-bold">{request.senderName}</p>
                <p className="text-sm text-gray-500">{request.time}</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                className="text-white w-24 py-2 bg-pink-500 rounded-lg text-sm transition-all ease-in-out duration-500 hover:scale-105"
                onClick={() =>
                  acceptRequest(
                    request.id,
                    request.senderId,
                    request.recipientId
                  )
                }
              >
                Accept
              </button>
              <button
                className="text-gray-500 w-24 border border-pink-500 rounded-lg py-2 text-sm transition-all ease-in-out duration-500 hover:scale-105"
                onClick={() => cancelRequest(request.id)}
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No friend requests</p>
      )}
    </div>
  );
};

export default FriendRequest;
