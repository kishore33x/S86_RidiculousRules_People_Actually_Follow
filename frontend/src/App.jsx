import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

import UserCard from "./components/UserCard";
import AddEntity from "./pages/AddEntity";
import EntityList from "./pages/EntityList";
import UpdateEntity from "./pages/UpdateEntity";
import Auth from "./pages/Auth";

function Home() {
  return (
    <div className="text-center mt-6">
      <h2 className="text-2xl font-bold text-gray-800">RIDICULOUS RULES PEOPLE ACTUALLY FOLLOW</h2>
      <p className="text-gray-600 mt-2">Manage your users and entities easily!</p>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch users.");
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <nav className="space-x-4">
              <Link to="/" className="text-blue-600 hover:underline">Home</Link>
              <Link to="/add-entity" className="text-blue-600 hover:underline">Add Entity</Link>
              <Link to="/entities" className="text-blue-600 hover:underline">Entity List</Link>
              <Link to="/auth" className="text-blue-600 hover:underline">Login / Logout</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 flex-1">
          <Routes>
            <Route path="/" element={
              <div>
                <Home />
                {/* Show users on homepage */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {error ? (
                    <div className="text-red-500 col-span-full">{error}</div>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <UserCard key={user.id} user={user} />
                    ))
                  ) : (
                    <p className="text-gray-600 col-span-full">No users available.</p>
                  )}
                </div>
              </div>
            } />
            <Route path="/add-entity" element={<AddEntity users={users} />} />
            <Route path="/entities" element={<EntityList />} />
            <Route path="/edit-entity/:id" element={<UpdateEntity />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<h2 className="text-red-500 text-center mt-10">404 - Page Not Found</h2>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white shadow text-center py-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} ASAP Project. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
