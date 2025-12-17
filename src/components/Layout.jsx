import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1320] text-[#0b1320] dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
