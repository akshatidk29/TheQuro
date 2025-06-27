import express from "express";
import { protectRoute } from "../Middleware/authMiddleware.js";
import { deleteDocument, getUserDocuments, updateDocument } from "../Controllers/documentController.js";

const router = express.Router();

router.get("/getDocs", protectRoute, getUserDocuments);
router.put("/update/:id", protectRoute, updateDocument);
router.post("/delete/:id", protectRoute, deleteDocument);

 
export default router;
