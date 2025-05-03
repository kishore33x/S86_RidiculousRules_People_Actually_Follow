import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserCard from "./components/UserCard";
import AddEntity from "./pages/AddEntity";
import EntityList from "./pages/EntityList";
import UpdateEntity from "./pages/UpdateEntity";

function Home() {
  return <h2 className="text-xl font-bold text-center">Welcome to the ASAP Project</h2>;
}

function App() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);  // State to handle error messages

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    }
  };

  // Fetch users when the component is mounted
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Information</h1>
        
        {/* Error handling display */}
        {error ? (
          <div className="text-red-500 mb-4">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          users.length > 0 ? (
            users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="text-gray-600">No users available.</p>
          )
        )}

        {/* Navigation */}
        <nav className="mt-6 space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/add-entity" className="text-blue-600 hover:underline">Add Entity</Link>
          <Link to="/entities" className="text-blue-600 hover:underline">Entity List</Link>
        </nav>

        {/* Routing */}
        <div className="mt-8 w-full max-w-2xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-entity" element={<AddEntity users={users} />} />
            <Route path="/entities" element={<EntityList />} />
            <Route path="/edit-entity/:id" element={<UpdateEntity />} />
            <Route path="*" element={<h2 className="text-red-500">404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
