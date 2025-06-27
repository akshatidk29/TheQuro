import { Router } from "express";
import multer, { memoryStorage } from "multer";
import { protectRoute } from "../Middleware/authMiddleware.js";
import { updateProfile, uploadProfilePhoto } from "../Controllers/profileController.js";

const router = Router();

const storage = memoryStorage();
const upload = multer({ storage });

router.post("/updatePic", upload.single("profilePhoto"), protectRoute, uploadProfilePhoto);
router.put("/update", protectRoute, updateProfile);

export default router;
