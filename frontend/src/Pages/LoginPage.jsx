import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../Stores/useAuthStore";
import { GoogleLoginButton } from "../Components/GoogleLoginButton";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

// Modular Input Component
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  required = false,
  icon: Icon,
  placeholder,
  error = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
              error ? "text-red-400" : "text-gray-400"
            }`}
          />
        )}
        <input
          required={required}
          type={inputType}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full h-12 px-4 ${Icon ? "pl-12" : ""} ${
            type === "password" ? "pr-12" : ""
          }
            bg-white 
            border ${
              error ? "border-red-300" : "border-gray-300"
            }
            rounded-xl text-gray-900
            placeholder-gray-500
            focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500" : "focus:ring-blue-500"
            } focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200 ease-in-out
            hover:border-gray-400
          `}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

// Modular Button Component
const Button = ({
  children,
  type = "button",
  disabled = false,
  variant = "primary",
  onClick,
  className = ""
}) => {
  const baseClasses =
    "w-full h-12 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
              text-white focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
              disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`,
    secondary: `${baseClasses} bg-white border-2 border-gray-300 
                text-gray-700 hover:bg-gray-50 focus:ring-gray-500`
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Error Alert Component
const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
      <span className="text-sm text-red-700">{message}</span>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { authUser, login, isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (authUser) return <Navigate to="/home" />;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[size:20px_20px]"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 
                               rounded-2xl mb-4 shadow-lg overflow-hidden">
              <img
                src="Quro.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to TheQuro
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
            {error && <ErrorAlert message={error} />}

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                icon={Mail}
                placeholder="Enter your email"
                error={!!error}
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                icon={Lock}
                placeholder="Enter your password"
                error={!!error}
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="mt-8"
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white/80">
                or continue with
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <GoogleLoginButton navigate={navigate} />

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
