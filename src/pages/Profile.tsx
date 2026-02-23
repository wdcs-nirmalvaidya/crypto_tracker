import { useState } from "react";
import { User } from "../types/common";

/* ---------------- Helper ---------------- */

const getStoredUser = (): User | null => {
  const stored = localStorage.getItem("user");

  try {
    if (stored) return JSON.parse(stored);
    return null;
  } catch {
    return null;
  }
};

/* ---------------- Component ---------------- */

const Profile = () => {
  const storedUser = getStoredUser();

  const [user, setUser] = useState<User | null>(storedUser);
  const [editMode, setEditMode] = useState<boolean>(false);

  const [form, setForm] = useState({
    firstName: storedUser?.firstName || "",
    lastName: storedUser?.lastName || "",
    username: storedUser?.username || "",
  });

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center text-gray-500">
        No profile data found
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
    };

    // ✅ Save back to correct key
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditMode(false);
  };

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-start pt-12">
      <div
        className="w-full max-w-3xl p-10 rounded-2xl shadow-xl text-white"
        style={{ backgroundColor: "#111A2B" }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          My Profile
        </h1>

        <div className="space-y-6 text-lg">
          {/* First Name */}
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-gray-400">
              First Name
            </span>
            {editMode ? (
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="text-right bg-transparent border-b border-white/20 outline-none w-1/2"
              />
            ) : (
              <span>{user.firstName}</span>
            )}
          </div>

          {/* Last Name */}
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-gray-400">
              Last Name
            </span>
            {editMode ? (
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="text-right bg-transparent border-b border-white/20 outline-none w-1/2"
              />
            ) : (
              <span>{user.lastName}</span>
            )}
          </div>

          {/* Username */}
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-gray-400">
              Username
            </span>
            {editMode ? (
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="text-right bg-transparent border-b border-white/20 outline-none w-1/2"
              />
            ) : (
              <span>{user.username}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex justify-between border-b border-white/10 pb-4">
            <span className="text-gray-400">
              Email
            </span>
            <span>{user.email}</span>
          </div>

          {/* Phone */}
          <div className="flex justify-between">
            <span className="text-gray-400">
              Phone
            </span>
            <span>{user.phone}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex justify-center gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-green-600 text-white"
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-2 rounded-lg border border-white/20"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;