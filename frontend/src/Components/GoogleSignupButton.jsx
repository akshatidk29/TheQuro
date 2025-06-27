import React from "react";
import { useAuthStore } from "../Stores/useAuthStore";

export const GoogleSignupButton = ({ navigate }) => {
    const { googleSignup } = useAuthStore();

    return (
        <button
            onClick={() => googleSignup(navigate)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 shadow hover:shadow-md transition"
        >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700">Continue with Google</span>
        </button>
    );
};


