import { create } from "zustand";
import { axiosInstance } from "../Lib/axios.js";

export const useDocStore = create((set) => ({
    documents: [],
    isLoading: false,
    error: null,

    getUserDocs: async () => {
        set({ isLoading: true, error: null });

        try {
            const res = await axiosInstance.get("/docs/getDocs");
            set({ documents: res.data.files, isLoading: false });
        } catch (err) {
            console.error("Failed to fetch documents:", err);
            set({ error: "Failed to fetch documents", isLoading: false });
        }
    },

    updateDocument: async (id, updatedFields) => {
        try {
            console.log(updatedFields)
            const res = await axiosInstance.put(`/docs/update/${id}`, updatedFields);
            const updatedDoc = res.data.document;

            set((state) => ({
                documents: state.documents.map((doc) =>
                    doc._id === id ? { ...doc, ...updatedFields } : doc
                ),
            }));
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update document");
        }
    },

    deleteDocument: async (id) => {
        try {
            await axiosInstance.post(`/docs/delete/${id}`);
            set((state) => ({
                documents: state.documents.filter((doc) => doc._id !== id),
            }));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete document");
        }
    },
}));
