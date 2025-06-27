import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExtractedFile",
    }
  ],
  metaDescriptions: [
    {
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtractedFile",
      },
      name: String,
      course: String,
      topic: String,
      description: String,
    }
  ],
}, { timestamps: true });

export default mongoose.model("OCRFolder", FolderSchema);
