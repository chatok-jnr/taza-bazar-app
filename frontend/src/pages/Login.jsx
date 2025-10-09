import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: formData.email,
        user_password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== "success") {
      throw new Error(data.message || "Login failed. Please try again.");
    }

    // Save user info (id, name, email) in context and localStorage
    const userData = {
      id: data.data._id,
      name: data.data.user_name,
      email: data.data.user_email,
    };

    login(userData); // save in context
    localStorage.setItem("user", JSON.stringify(userData)); // persist across refresh

    navigate("/"); // redirect to homepage
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">TazaBazar</h1>
          <p className="text-gray-600">Welcome back to our farming community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`block w-full py-3 ${
                  loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } text-white text-center rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">
              Don't have an account?
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <Link
            to="/signup"
            className="block w-full text-center py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
