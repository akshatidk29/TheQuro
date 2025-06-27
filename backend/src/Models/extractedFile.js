import mongoose from "mongoose";

const ExtractedFileSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  name: String,
  course: String,
  topic: String,
  description: String,
  date: String,
  time: String,
  fileType: {
    type: String,
    enum: ["pdf", "image"],
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model("ExtractedFile", ExtractedFileSchema);
