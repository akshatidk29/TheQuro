import axios from "axios";
import OCRFolder from "../Models/ocrFolder.js";
import ExtractedFile from "../Models/ExtractedFile.js";

export const getUserDocuments = async (req, res) => {
  try {
    const email = req.user?.email;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const folder = await OCRFolder.findOne({ userEmail: email });

    if (!folder || folder.files.length === 0) {
      return res.status(404).json({ error: "No documents found for this user" });
    }

    const extractedFiles = await ExtractedFile.find({
      _id: { $in: folder.files },
    });

    res.status(200).json({
      files: extractedFiles.map(file => ({
        _id: file._id,
        name: file.name,
        course: file.course,
        topic: file.topic,
        description: file.description,
        date: file.date,
        time: file.time,
        fileType: file.fileType,
        extractedText: file.extractedText,
        createdAt: file.createdAt,
      })),
    });

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to retrieve documents" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const docId = req.params.id;
    const email = req.user?.email;
    console.log(req.body)
    const { name, topic, description, course } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });

    const oldFile = await ExtractedFile.findById(docId);
    if (!oldFile) {
      return res.status(404).json({ error: "Document not found" });
    }

    const oldTopic = oldFile.topic;
    const oldCourse = oldFile.course;

    oldFile.name = name || oldFile.name;
    oldFile.topic = topic || oldFile.topic;
    oldFile.description = description || oldFile.description;
    oldFile.course = course || oldFile.course;

    await oldFile.save();

    const folder = await OCRFolder.findOne({ userEmail: email });
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const meta = folder.metaDescriptions.find((entry) => entry.fileId.toString() === docId);
    if (meta) {
      if (name) meta.name = name;
      if (topic) meta.topic = topic;
      if (description) meta.description = description;
      if (course) meta.course = course;
      await folder.save();
    }

    await axios.post(`${process.env.IPV4_URL}:8001/rag/update`, {
      old_course: oldCourse,
      old_topic: oldTopic,
      userEmail: email,
      new_course: oldFile.course,
      new_topic: oldFile.topic,
      new_description: oldFile.description,
      new_text: oldFile.extractedText,
      name: oldFile.name,
      date: oldFile.date,
      time: oldFile.time || "",
      file_type: oldFile.fileType,
    });

    res.status(200).json({
      message: "Document and vector updated successfully",
      document: oldFile,
    });

  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Failed to update document and vector" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userEmail = req.user?.email;

    if (!fileId || !userEmail) {
      return res.status(400).json({ error: "Missing file ID or user email." });
    }

    // Step 1: Find and delete the file
    const file = await ExtractedFile.findByIdAndDelete(fileId);
    if (!file) {
      return res.status(404).json({ error: "Document not found in database." });
    }

    const { course, topic } = file;

    // Step 2: Remove file reference from OCRFolder
    const folder = await OCRFolder.findOne({ userEmail });
    if (folder) {
      folder.files = folder.files.filter((id) => id.toString() !== fileId);
      folder.metaDescriptions = folder.metaDescriptions.filter(
        (entry) => entry.fileId.toString() !== fileId
      );
      await folder.save();
    }

    // Step 3: Call FastAPI to delete vector from Qdrant
    const response = await axios.post(`${process.env.IPV4_URL}:8001/rag/delete`, {
      userEmail,
      course,
      topic,
    });

    return res.status(200).json({
      status: "success",
      message: "Document and vector deleted successfully.",
      response: response.data,
    });
  } catch (error) {
    console.error("Vector deletion error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete document/vector.",
      error: error?.response?.data || error.message,
    });
  }
};
