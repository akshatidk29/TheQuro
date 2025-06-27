import React, { useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../Stores/useAuthStore";
import { GoogleSignupButton } from "../Components/GoogleSignupButton";
import { Eye, EyeOff, Mail, User, Lock, CheckCircle } from "lucide-react";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  required = false,
  icon: Icon,
  placeholder
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          required={required}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full h-12 px-4 ${Icon ? 'pl-12' : ''} ${type === 'password' ? 'pr-12' : ''}
            bg-white dark:bg-gray-800 
            border border-gray-300 dark:border-gray-600 
            rounded-xl text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200 ease-in-out
            hover:border-gray-400 dark:hover:border-gray-500
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

// Modular OTP Input Component
const OTPInput = ({ otpDigits, otpRefs, onOtpChange, onOtpKeyDown }) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Check your email
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          We've sent a 6-digit verification code to your email address
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {otpDigits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (otpRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => onOtpChange(idx, e.target.value)}
            onKeyDown={(e) => onOtpKeyDown(e, idx)}
            className="w-12 h-14 text-xl font-semibold text-center 
                     bg-white dark:bg-gray-800 
                     border-2 border-gray-300 dark:border-gray-600 
                     rounded-xl text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200"
          />
        ))}
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
  const baseClasses = "w-full h-12 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
              text-white focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
              disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`,
    secondary: `${baseClasses} bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 
                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500`
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

const SignUpPage = () => {
  const navigate = useNavigate();
  const {
    initiateSignup,
    verifySignupOtp,
    isSigningUp,
    authUser,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [otpStage, setOtpStage] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  if (authUser) return <Navigate to="/home" />;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      password: formData.password,
    };
    const success = await initiateSignup(data);
    if (success) setOtpStage(true);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) return;
    await verifySignupOtp(otp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[size:20px_20px]"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">Q</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Join TheQuro
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {otpStage ? "Almost there! Verify your email" : "Create your account and start taking better notes"}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20">
            <form onSubmit={otpStage ? handleOtpSubmit : handleFormSubmit} className="space-y-6">
              {!otpStage ? (
                <>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      icon={User}
                      placeholder="John"
                    />
                    <FormInput
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      icon={User}
                      placeholder="Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    icon={Mail}
                    placeholder="john@example.com"
                  />

                  {/* Password Field */}
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    icon={Lock}
                    placeholder="Create a strong password"
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSigningUp}
                    className="mt-8"
                  >
                    {isSigningUp ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <OTPInput
                    otpDigits={otpDigits}
                    otpRefs={otpRefs}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                  />

                  {/* Verify Button */}
                  <Button
                    type="submit"
                    disabled={otpDigits.join("").length !== 6}
                    className="mt-8"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Verify & Create Account
                    </div>
                  </Button>

                  {/* Back Button */}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOtpStage(false)}
                  >
                    Back to Form
                  </Button>
                </>
              )}
            </form>

            {!otpStage && (
              <>
                {/* Divider */}
                <div className="my-8 flex items-center">
                  <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                  <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80">
                    or continue with
                  </span>
                  <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                {/* Google Sign Up */}
                <GoogleSignupButton navigate={navigate} />

                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;