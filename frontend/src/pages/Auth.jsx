import React, { useState } from "react";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
      credentials: "include", // very important for cookies
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const handleLogout = async () => {
    const res = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login / Logout</h2>
      <input
        className="w-full border p-2 mb-4"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
