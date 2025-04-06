import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EntityList = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchEntities = () => {
    fetch("http://localhost:3000/api/entities")
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
    fetchEntities();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/entities/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete entity");

      // Remove from local state
      setEntities(entities.filter((e) => e._id !== id));
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
      {entities.length === 0 ? (
        <p>No entities found.</p>
      ) : (
        <ul className="list-disc pl-5 space-y-2">
          {entities.map((entity) => (
            <li
              key={entity._id}
              className="border p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <strong>{entity.name}</strong> - {entity.description}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(entity._id)}
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entity._id)}
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
