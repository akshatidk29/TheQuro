import React, { useState, useEffect } from "react";
import { useUploadStore } from "../Stores/useUploadStore";
import { useAuthStore } from "../Stores/useAuthStore";
import UploadForm from "../Components/UploadForm";
import { Upload, ChevronDown, ChevronUp } from "lucide-react";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [date, setDate] = useState(""); // Auto-set, not passed from form

  const { uploadFile, isUploading, uploadResult } = useUploadStore();
  const { checkAuth } = useAuthStore();

  // Set current date once when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // format: yyyy-mm-dd
    setDate(today);
  }, []);

  const handleSubmit = async () => {
    await uploadFile({ file, course, topic, name, date, description });
    checkAuth();
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-50 shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          <Upload className="text-blue-600" /> Upload Note
        </h2>

        <UploadForm
          file={file}
          setFile={setFile}
          course={course}
          setCourse={setCourse}
          topic={topic}
          setTopic={setTopic}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          handleSubmit={handleSubmit}
          isUploading={isUploading}
        />

        {uploadResult && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-sm text-green-800 space-y-2">
            <div>
              <span className="font-medium text-green-900">Uploaded:</span>{" "}
              <strong>{uploadResult.topic}</strong>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 text-green-700 hover:text-green-900 transition text-sm font-medium focus:outline-none"
            >
              {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showPreview ? "Hide Full Preview" : "Show Full Preview"}
            </button>
            {showPreview && (
              <div className="max-h-48 overflow-y-auto bg-white border border-green-200 rounded-md p-3 text-gray-700 whitespace-pre-wrap text-sm">
                {uploadResult.preview}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
