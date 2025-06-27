import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import multer from "multer";
import mime from "mime-types";
import FormData from "form-data";
import OCRFolder from "../Models/ocrFolder.js";
import ExtractedFile from "../Models/ExtractedFile.js";
import { deductTokens, creditTokens } from "./tokenController.js";

dotenv.config();




export const handleUpload = async (req, res) => {
  try {
    const { course, topic, name, date, time, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded." });

    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: "Unauthorized: No user email found." });

    const filePath = path.resolve(file.path);
    const mimeType = mime.lookup(filePath);

    if (!["image/png", "image/jpeg", "image/jpg", "application/pdf"].includes(mimeType)) {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    const isPDF = mimeType === "application/pdf";
    let tokensNeeded = 0;

    if (isPDF) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath));
      const pageRes = await axios.post(`${process.env.IPV4_URL}:8001/calculatePages/pdf`, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      });
      const numPages = pageRes.data?.pages;
      if (!numPages || numPages <= 0) {
        return res.status(400).json({ error: "Failed to count PDF pages." });
      }
      tokensNeeded = numPages * parseInt(process.env.TOKEN_COST_PER_PAGE);
    }
    else {
      tokensNeeded = parseInt(process.env.TOKEN_COST_PER_PAGE);
    }
    try {
      await deductTokens({
        userEmail,
        tokensToDeduct: tokensNeeded,
        reason: `Uploaded ${isPDF ? "a PDF" : "an Image"}: ${name}`,
      });
    } catch (err) {
      return res.status(403).json({ error: err.message });
    }

    const formData = new FormData();
    formData.append("userEmail", userEmail);
    formData.append("file", fs.createReadStream(filePath));
    formData.append("name", name);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("topic", topic);
    formData.append("course", course);
    formData.append("description", description);

    const endpoint = isPDF
      ? `${process.env.IPV4_URL}:8001/extract/pdf`
      : `${process.env.IPV4_URL}:8001/extract/image`;

    try {
      const ocrRes = await axios.post(endpoint, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
      });

      const { text: extractedText, metadata } = ocrRes.data;

      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete uploaded file:", err.message);
      });

      const fileDoc = await ExtractedFile.create({
        userEmail,
        name,
        course,
        topic,
        description,
        date,
        time,
        fileType: isPDF ? "pdf" : "image",
        extractedText,
      });

      let folder = await OCRFolder.findOne({ userEmail });

      if (!folder) {
        folder = await OCRFolder.create({
          userEmail,
          files: [fileDoc._id],
          metaDescriptions: [{
            fileId: fileDoc._id,
            name,
            course,
            topic,
            description,
          }],
        });
      } else {
        folder.files.push(fileDoc._id);
        folder.metaDescriptions.push({
          fileId: fileDoc._id,
          name,
          course,
          topic,
          description,
        });
        await folder.save();
      }

      return res.status(200).json({
        message: "Uploaded successfully",
        topic: fileDoc.topic,
        preview: fileDoc.extractedText.slice(0, 200),
        fileId: fileDoc._id,
        metadata,
      });

    } catch (error) {
      console.error("OCR processing failed:", error.message);

      try {
        await creditTokens({
          userEmail,
          tokensToCredit: tokensNeeded,
          reason: `Upload failed for ${name}, tokens refunded`,
        });
      } catch (refundErr) {
        console.error("Refund failed:", refundErr.message);
        return res.status(500).json({ error: "OCR failed and refund failed." });
      }

      return res.status(500).json({ error: "OCR extraction failed. Tokens refunded." });
    }

  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Failed to upload or process file." });
  }
};

export const createMulterUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "uploads/";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });

  return multer({ storage });
};
