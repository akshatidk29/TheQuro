import cloudinary from "../Lib/cloudinary.js";
import User from "../Models/userModel.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized: No user ID" });

        const { fullName, email } = req.body;

        if (!fullName && !email) {
            return res.status(400).json({ message: "No update data provided" });
        }

        const updates = {};
        if (fullName) updates.fullName = fullName;
        if (email) updates.email = email; // Only update if allowed

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        }).select("-password"); // Avoid sending password back

        res.json(updatedUser);
    } catch (err) {
        console.error("Profile update failed:", err);
        res.status(500).json({ message: "Profile update error", error: err.message });
    }
};

export const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized: No user ID" });

        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const base64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${base64}`;

        // ✅ Correct method
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "profile_photos",
        });

        await User.findByIdAndUpdate(userId, {
            profilePic: result.secure_url, // 📝 assuming your schema uses 'profilePic'
        });

        res.json({ message: "Uploaded", url: result.secure_url });
    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        res.status(500).json({ message: "Upload error", error: err.message });
    }
};
