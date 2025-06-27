import { create } from "zustand";
import { axiosInstance } from "../Lib/axios.js";
import toast from "react-hot-toast";


export const useUploadStore = create((set) => ({
  isUploading: false,
  uploadResult: null,

  uploadFile: async ({ file, course, topic, visibility, name, date, description }) => {
    if (!file || !course || !topic || !name || !date || !description) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", course);
    formData.append("topic", topic);
    formData.append("name", name);
    formData.append("date", date);
    formData.append("description", description);

    try {
      set({ isUploading: true, uploadResult: null });

      const res = await axiosInstance.post("/notes/upload", formData);
      set({ uploadResult: res.data });
      toast.success("Uploaded Succesfully")
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response.data.error)
    } finally {
      set({ isUploading: false });
    }
  },
}));
