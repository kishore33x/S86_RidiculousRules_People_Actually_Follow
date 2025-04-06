import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateEntity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  // Fetch the existing entity data
  useEffect(() => {
    fetch(`http://localhost:3000/api/entities/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entity data");
        return res.json();
      })
      .then((data) => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category || "");
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/entities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });

      if (!res.ok) throw new Error("Failed to update entity");

      // Navigate back to entity list after successful update
      navigate("/entities");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Entity</h2>

      {error && <p className="text-red-500 mb-2 text-center">Error: {error}</p>}

      <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateEntity;
