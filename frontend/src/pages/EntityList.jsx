import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EntityList = () => {
  const [entities, setEntities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = () => {
    fetch("http://localhost:3000/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error("User fetch error:", err));
  };

  const fetchEntities = (userId = "") => {
    const url = userId
      ? `http://localhost:3000/api/entities?user_id=${userId}`
      : "http://localhost:3000/api/entities";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entities");
        return res.json();
      })
      .then((data) => {
        setEntities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetchEntities();
  }, []);

  useEffect(() => {
    fetchEntities(selectedUserId);
  }, [selectedUserId]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/entities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete entity");

      // Remove from local state using correct ID field
      setEntities((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-entity/${id}`);
  };

  if (loading) return <p>Loading entities...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Entity List</h2>

      {/* Filter Dropdown */}
      <label className="block mb-2 font-medium text-gray-700">
        Filter by User:
      </label>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-sm"
      >
        <option value="">-- All Users --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {entities.length === 0 ? (
        <p>No entities found.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {entities.map((entity) => (
            <li
              key={entity.id}
              className="border p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <strong>{entity.title}</strong> - {entity.description}
                <p className="text-sm text-gray-500">
                  Created by: {entity.created_by_name || "Unknown"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(entity.id)}
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entity.id)}
                  className="bg-red-500 px-2 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntityList;
