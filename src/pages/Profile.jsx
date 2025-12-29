import { useState } from "react";

export default function Profile() {
  const storedUser =
    JSON.parse(localStorage.getItem("signupUser")) ||
    JSON.parse(localStorage.getItem("localUser"));

  const [user, setUser] = useState(storedUser);
  const [editMode, setEditMode] = useState(false);

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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    const updatedUser = {
      ...user,
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
    };

    localStorage.setItem("signupUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditMode(false);
  }

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-start pt-12">

      <div
        className="
          w-full max-w-3xl p-10 rounded-2xl shadow-xl

          bg-white text-[#0b2545] border border-[#e2e8f0]
          dark:bg-gradient-to-br dark:from-[#0b1320] dark:to-[#111a2b]
          dark:text-white dark:border-[#1c2940]
        "
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          My Profile
        </h1>

        <div className="space-y-6 text-xl">

          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <span className="text-gray-500 dark:text-gray-300">
              First Name
            </span>
            {editMode ? (
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="text-right bg-transparent border-b outline-none font-semibold w-1/2"
              />
            ) : (
              <span className="font-semibold">
                {user.firstName}
              </span>
            )}
          </div>


          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <span className="text-gray-500 dark:text-gray-300">
              Last Name
            </span>
            {editMode ? (
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="text-right bg-transparent border-b outline-none font-semibold w-1/2"
              />
            ) : (
              <span className="font-semibold">
                {user.lastName}
              </span>
            )}
          </div>


          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <span className="text-gray-500 dark:text-gray-300">
              Username
            </span>
            {editMode ? (
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="text-right bg-transparent border-b outline-none font-semibold w-1/2"
              />
            ) : (
              <span className="font-semibold">
                {user.username}
              </span>
            )}
          </div>

          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <span className="text-gray-500 dark:text-gray-300">
              Email
            </span>
            <span className="font-semibold break-all text-right">
              {user.email}
            </span>
          </div>


          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-300">
              Phone
            </span>
            <span className="font-semibold">
              {user.phone}
            </span>
          </div>
        </div>


        <div className="mt-10 flex justify-center gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-[#0b1320] text-white"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-6 py-2 rounded-lg border"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 rounded-lg bg-[#0b1320] text-white"
            >
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
