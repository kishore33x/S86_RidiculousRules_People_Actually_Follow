import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserCard from "./components/UserCard";
import AddEntity from "./pages/AddEntity";
import EntityList from "./pages/EntityList";
import UpdateEntity from "./pages/UpdateEntity";

function Home() {
  return <h2 className="text-xl font-bold text-center">Welcome to the ASAP Project</h2>;
}

function App() {
  const dummyUser = {
    username: "john_doe",
    email: "john.doe@example.com",
    role: "User",
  };

  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">User Information</h1>
        <UserCard user={dummyUser} />

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
            <Route path="/add-entity" element={<AddEntity />} />
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
