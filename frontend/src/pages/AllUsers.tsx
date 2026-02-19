import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched users:", res.data); // <-- debug

      if (res.data.success) {
        setUsers(res.data.users);
      } else {
        setError(res.data.message || "Failed to fetch users");
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  // Soft delete / deactivate user
  const deactivateUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deactivated successfully");
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error("Error deactivating user:", err);
      alert(err.response?.data?.message || "Failed to deactivate user");
    }
  };

  // Placeholder for edit functionality
  const editUser = (id: string) => {
    alert(`Edit user functionality for ID: ${id} (to implement)`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {!loading && users.length > 0 && (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className={user.isActive ? "" : "bg-red-100"}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.isActive ? "Active" : "Inactive"}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => editUser(user._id)}
                  >
                    Edit
                  </button>
                  {user.isActive && (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => deactivateUser(user._id)}
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllUsers;
