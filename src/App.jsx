import React from "react";
import UserCard from "./UserCard"; // Import the UserCard component

function App() {
  // Dummy user data
  const dummyUser = {
    username: "john_doe",
    email: "john.doe@example.com",
    role: "User",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Information</h1>
      <UserCard user={dummyUser} />
    </div>
  );
}

export default App;
