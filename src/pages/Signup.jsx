import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (Object.values(form).some(val => !val)) {
      setError("All fields are required");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Save user for the Profile page
    localStorage.setItem("signupUser", JSON.stringify(form));
    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden py-10">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-600/10 rounded-full blur-[150px]" />

      {/* Glassmorphism Card */}
      <div className="w-full max-w-2xl mx-4 bg-[#0b1320]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-white">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
            <span className="font-black">₿</span>
          </div>
          <h1 className="text-3xl font-extrabold mt-4 tracking-tight">Create <span className="text-emerald-400">Account</span></h1>
          <p className="text-gray-400 text-sm mt-1">Join the future of asset tracking</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 rounded-xl text-center mb-6 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Grid for Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">First Name</label>
              <input type="text" name="firstName" placeholder="John" className="signup-input" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" className="signup-input" onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Username</label>
            <input type="text" name="username" placeholder="crypto_king" className="signup-input" onChange={handleChange} />
          </div>

          {/* Grid for Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email</label>
              <input type="email" name="email" placeholder="john@example.com" className="signup-input" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Phone Number</label>
              <input type="text" name="phone" placeholder="1234567890" className="signup-input" onChange={handleChange} />
            </div>
          </div>

          {/* Grid for Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Password</label>
              <input type="password" name="password" placeholder="••••••••" className="signup-input" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="••••••••" className="signup-input" onChange={handleChange} />
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all font-bold text-white mt-6 active:scale-[0.98]">
            Sign Up Now
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            Already a member? 
            <Link to="/login" className="text-emerald-400 font-semibold ml-2 hover:text-emerald-300 transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .signup-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          color: white;
        }
        .signup-input:focus {
          border-color: rgba(16, 185, 129, 0.5);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </div>
  );
}