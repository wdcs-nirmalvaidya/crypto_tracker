export default function Profile() {
  const user =
    JSON.parse(localStorage.getItem("signupUser")) ||
    JSON.parse(localStorage.getItem("localUser"));

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center text-gray-500">
        No profile data found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-start pt-12">
      {/* BIG PROFILE CARD */}
      <div
        className="
          w-full max-w-3xl p-10 rounded-2xl shadow-xl

          /* 🌞 LIGHT MODE */
          bg-white
          text-[#0b2545]
          border border-[#e2e8f0]

          /* 🌙 DARK MODE */
          dark:bg-gradient-to-br dark:from-[#0b1320] dark:to-[#111a2b]
          dark:text-white
          dark:border-[#1c2940]
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
            <span className="font-semibold">
              {user.firstName}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <span className="text-gray-500 dark:text-gray-300">
              Last Name
            </span>
            <span className="font-semibold">
              {user.lastName}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-4">
            <span className="text-gray-500 dark:text-gray-300">
              Username
            </span>
            <span className="font-semibold">
              {user.username}
            </span>
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
      </div>
    </div>
  );
}
