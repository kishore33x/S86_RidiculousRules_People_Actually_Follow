import React, { useEffect, useState } from "react";
import axios from "axios";

const EntityForm = () => {
  const [users, setUsers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    created_by: "",
  });

  const [selectedUser, setSelectedUser] = useState("");

  // Fetch all users
  useEffect(() => {
    axios.get("http://localhost:3000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // Fetch entities when selectedUser changes
  useEffect(() => {
    let url = "http://localhost:3000/api/entities";
    if (selectedUser) {
      url += `?user_id=${selectedUser}`;
    }

    axios.get(url)
      .then((res) => setEntities(res.data))
      .catch((err) => console.error("Error fetching entities:", err));
  }, [selectedUser]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new entity
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3000/api/entities", form)
      .then((res) => {
        alert("Entity created!");
        setForm({ title: "", description: "", category: "", created_by: "" });
        setSelectedUser(""); // Reset filter to show all
      })
      .catch((err) => {
        console.error("Error creating entity:", err);
        alert("Failed to create entity");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create Entity</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        /><br /><br />
        <select
          name="created_by"
          value={form.created_by}
          onChange={handleChange}
          required
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select><br /><br />
        <button type="submit">Add Entity</button>
      </form>

      <h3>Filter by User</h3>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">-- Show All --</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: "2rem" }}>Entities</h3>
      <ul>
        {entities.map((e) => (
          <li key={e._id}>
            <strong>{e.title}</strong> - {e.description} [{e.category}]
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntityForm;
