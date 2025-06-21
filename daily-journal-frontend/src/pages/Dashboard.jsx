import { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ content: "", mood: "" });
  const [editForm, setEditForm] = useState({ content: "", mood: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const res = await axios.get("/journals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/journals", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setForm({ content: "", mood: "" });
      fetchEntries();
    } catch (err) {
      console.error("Failed to submit entry", err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/journals/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setEditingId(null);
      setShowModal(false);
      setEditForm({ content: "", mood: "" });
      fetchEntries();
    } catch (err) {
      console.error("Failed to update entry", err);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry._id);
    setEditForm({ content: entry.content, mood: entry.mood });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/journals/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchEntries();
    } catch (err) {
      console.error("Failed to delete entry", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredEntries = filterDate
    ? entries.filter((entry) => {
        const entryDate = new Date(entry.date).toISOString().split("T")[0];
        return entryDate === filterDate;
      })
    : entries;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📒 My Journal Entries</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* Add Entry Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your journal entry..."
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          name="mood"
          value={form.mood}
          onChange={handleChange}
          placeholder="Mood (e.g., happy, sad)"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Entry
        </button>
      </form>

      {/* Date Filter */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Filter by Date:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        />
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Entry</h2>
            <form onSubmit={handleEditSubmit}>
              <textarea
                name="content"
                value={editForm.content}
                onChange={handleEditChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <input
                name="mood"
                value={editForm.mood}
                onChange={handleEditChange}
                className="w-full p-2 border rounded mb-2"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                    setEditForm({ content: "", mood: "" });
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <p>No entries found.</p>
      ) : (
        filteredEntries.map((entry) => (
          <div key={entry._id} className="mb-4 p-4 bg-white rounded shadow">
            <p className="mb-2">{entry.content}</p>
            <p className="text-sm text-gray-500">Mood: {entry.mood}</p>
            <p className="text-sm text-gray-400 mb-2">
              Date: {entry.date ? new Date(entry.date).toLocaleString() : "Unknown"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(entry)}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(entry._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
