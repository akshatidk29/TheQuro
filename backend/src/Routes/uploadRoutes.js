import express from "express";
import { handleUpload, createMulterUpload } from "../Controllers/uploadController.js";
import { protectRoute } from "../Middleware/authMiddleware.js";

const router = express.Router();
const upload = createMulterUpload();

router.post("/upload", upload.single("file"), protectRoute, handleUpload);

export default router;
