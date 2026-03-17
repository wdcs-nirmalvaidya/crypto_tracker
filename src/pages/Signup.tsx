import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupForm } from "../types/auth";
import { API_BASE_URL } from "../config";

const Signup = () => {
  const [form, setForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (Object.values(form).some((val) => !val.trim())) {
      return "All fields are required";
    }

    if (!form.email.includes("@")) {
      return "Enter a valid email address";
    }

    if (!/^\d{10}$/.test(form.phone)) {
      return "Phone number must be exactly 10 digits";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters long";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            username: form.username,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // ✅ Store JWT
      localStorage.setItem("token", data.token);

      // 🔥 IMPORTANT FIX: Store under signupUser
      localStorage.setItem(
        "signupUser",
        JSON.stringify(data.user)
      );

      navigate("/home");

    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] py-10">
      <div className="w-full max-w-2xl mx-4 bg-[#0b1320]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-white">

        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Create <span className="text-emerald-400">Account</span>
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">

          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="signup-input" />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="signup-input" />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="signup-input" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="signup-input" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="signup-input" />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="signup-input" />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="signup-input" />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 rounded-xl font-bold text-white mt-6 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up Now"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already a member?
            <Link to="/login" className="text-emerald-400 font-semibold ml-2">
              Log In
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .signup-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: white;
          outline: none;
        }
        .signup-input:focus {
          border-color: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Signup;