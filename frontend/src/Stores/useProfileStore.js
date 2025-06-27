import { create } from "zustand";
import { axiosInstance } from "../Lib/axios.js";

export const useProfileStore = create((set, get) => ({
    profile: null,
    loading: false,
    error: null,

    updateProfile: async (updates) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.put("/profile/update", updates);
            set({ profile: res.data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || "Failed to update profile",
                loading: false,
            });
        }
    },

    updateProfilePhoto: async (file) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append("profilePhoto", file);

            const res = await axiosInstance.post("/profile/updatePic", formData);
            const photoUrl = res.data.url;

            set((state) => ({
                profile: { ...state.profile, profilePic: photoUrl },
                loading: false,
            }));

            return photoUrl;
        } catch (err) {
            set({
                error: err.response?.data?.message || "Profile photo upload failed",
                loading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));
