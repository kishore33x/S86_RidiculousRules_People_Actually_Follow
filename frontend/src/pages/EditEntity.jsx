import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditEntity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/entities/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entity data");
        return res.json();
      })
      .then((data) => {
        setEntity(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/entities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entity),
      });

      if (!res.ok) throw new Error("Failed to update entity");

      navigate("/entities");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading entity...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!entity) return <p>No entity found</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Entity</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="title"
          value={entity.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={entity.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={entity.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditEntity;
