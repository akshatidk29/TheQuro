import express from "express";
import { ragQuery, Query } from "../Controllers/chatController.js";
import { protectRoute } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/query", protectRoute, ragQuery);
router.post("/general", protectRoute, Query);


export default router;