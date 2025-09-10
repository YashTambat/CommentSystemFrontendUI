"use client";
import { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";

// Function to get initials for the user avatar
const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return parts[0][0] + parts[1][0];
  }
  return parts[0][0];
};

export default function Home() {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest, "asc" = oldest
  const [selectedUser, setSelectedUser] = useState(null);
  const [commentText, setCommentText] = useState("");
 
    const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch("/api/comments");
      const data = await response.json();
      setComments(data);
    };

    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
      // if (data.length > 0) setSelectedUser(data[0]);
    };

    fetchComments();
    fetchUsers();
  }, []);

  // Function to find the user for a given comment
  const findUser = (commentEmail) => {
    return users.find((user) => user.email === commentEmail);
  };

  // Sort comments based on sortOrder
  const sortedComments = [...comments].sort((a, b) =>
    sortOrder === "asc" ? a.id - b.id : b.id - a.id
  );

    // Handle posting comment
  const handlePostComment = () => {
    if (!selectedUser || !commentText.trim()) return;

    const newComment = {
      id: comments.length + 1, // temp id
      email: selectedUser.email,
      body: commentText,
    };

    // Add to top of comments
    setComments([newComment, ...comments]);

    // Reset inputs
    setSelectedUser(null);
    setCommentText("");

    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // hide after 3s
  };

  return (
    <div className="bg-white min-h-screen py-6 px-3 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-800">
          Comment System
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm sm:text-base">
          Share your thoughts and engage with the community. Join the
          conversation below!
        </p>

        {/* Add a Comment Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-blue-500"
            >
              <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
            </svg>
            <span className="ml-2">Add a Comment</span>
          </h2>

          {/* User Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <Listbox value={selectedUser} onChange={setSelectedUser}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm text-black">
                  {selectedUser
                    ? `${selectedUser.name} (${selectedUser.company.name})`
                    : "Choose a user to comment as..."}
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {users.map((user) => (
                    <Listbox.Option
                      key={user.id}
                      value={user} // pass the whole user object
                      className={({ active }) =>
                        `cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                          active ? "bg-[#1d2839] text-white" : "text-black"
                        }`
                      }
                    >
                      {({ active }) => (
                        <div className="flex items-center">
                          {/* Avatar */}
                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-2 ${
                              active
                                ? "bg-white text-[#1d2839]"
                                : "bg-[#1d2839] text-white"
                            }`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <span className="block truncate">
                            {user.name} ({user.company.name})
                          </span>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Comment Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Comment
            </label>
            <textarea
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm 
      focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 text-black"
              placeholder="Write your comment here..."
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText} // optional, to bind state
            ></textarea>
          </div>

          {/* Post Button aligned Left */}
          <div className="flex justify-start">
             <button
          disabled={!selectedUser || !commentText.trim()}
          onClick={handlePostComment}
          className={`flex items-center py-2 px-4 rounded-md font-semibold transition duration-300 ${
            !selectedUser || !commentText.trim()
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L8 8.586V4a1 1 0 00-2 0v4.586l-1.293-1.293a1 1 0 00-1.414 1.414L7 12.414V16a1 1 0 002 0v-3.586l1.293 1.293a1 1 0 001.414-1.414L10.414 10z"
                  clipRule="evenodd"
                />
              </svg>
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg  p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">
              Comments ({comments.length})
            </h2>

            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => setSortOrder("desc")}
                className={`flex items-center px-4 py-2 rounded-md border transition-colors duration-200 
      ${
        sortOrder === "desc"
          ? "bg-blue-600 text-white font-semibold border-blue-600"
          : "bg-white text-black border-gray-300"
      } 
      hover:bg-[#1d2839] hover:text-white`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Newest
              </button>

              <button
                onClick={() => setSortOrder("asc")}
                className={`flex items-center px-4 py-2 rounded-md border transition-colors duration-200 
      ${
        sortOrder === "asc"
          ? "bg-blue-600 text-white font-semibold border-blue-600"
          : "bg-white text-black border-gray-300"
      } 
      hover:bg-[#1d2839] hover:text-white`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Oldest
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-8">
            {sortedComments.map((comment) => {
              const user = findUser(comment.email);
              return (
                <div
                  key={comment.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 border rounded-md p-4 transition-shadow duration-200 hover:shadow-md hover:shadow-gray-300"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mb-2 sm:mb-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#1d2839]">
                      {getInitials(user?.name)}
                    </div>
                  </div>

                  {/* Comment Body */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {user?.name}
                        </h4>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <span className="text-xs mt-1 sm:mt-0 text-[#1d2839]">
                        {user?.company.name}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 break-words">
                      {comment.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNotification && (
        <div className="fixed bottom-4 right-4 bg-white text-black px-4 py-3 rounded shadow-lg shadow-gray-300 animate-slide-in">

          <h4 className="font-semibold">Comment Posted</h4>
          <p className="text-sm">Your comment has been successfully added!</p>
        </div>
      )}
        
      </div>
    </div>
  );
}
