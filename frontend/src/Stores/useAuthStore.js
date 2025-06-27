import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../Lib/axios.js";


import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase.js";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    initiateSignup: async (data) => {
        set({ isSigningUp: true });
        try {
            await axiosInstance.post("/auth/signup", data);
            set({ tempSignupData: data });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    verifySignupOtp: async (otp) => {
        const data = get().tempSignupData;
        if (!data) return toast.error("Missing signup data");

        try {
            const res = await axiosInstance.post("/auth/verify-otp", {
                ...data,
                otp,
            });
            set({ authUser: res.data });
            toast.success("Signed in Successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP");
        }
    },



    googleSignup: async (navigate) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { displayName, email, photoURL } = result.user;

            const res = await axiosInstance.post("/auth/signup/google", {
                fullName: displayName,
                email,
                profilePic: photoURL,
            });

            set({ authUser: res.data });
            toast.success("Signed in Successfully");
            navigate("/home/user/dashboard");
        } catch (err) {
            console.error("Google Sign-in error:", err.message);
            toast.error(err.response.data.message);
        }
    },


    googleLogin: async (navigate) => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { displayName, email, photoURL } = result.user;

            const res = await axiosInstance.post("/auth/login/google", {
                fullName: displayName,
                email,
                profilePic: photoURL,
            });

            set({ authUser: res.data });
            toast.success("Logged in Successfully");
            navigate("/home/user/dashboard");
        } catch (err) {
            console.error("Google Login error:", err.message);
            toast.error(err.response.data.message);
        }
    },


}));