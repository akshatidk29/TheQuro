import React, { useState } from "react";
import { useUploadStore } from "../Stores/useUploadStore";
import { useAuthStore } from "../Stores/useAuthStore";
import UploadForm from "../Components/UploadForm";
import { Upload } from "lucide-react";
const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const { uploadFile, isUploading, uploadResult } = useUploadStore();
  const { checkAuth } = useAuthStore();
  const handleSubmit = async () => {
    await uploadFile({ file, course, topic, name, date, description });
    checkAuth(); 
  };


  return (
    <div className="min-h-screen bg-white px-4 py-10 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-50 shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
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
          date={date}
          setDate={setDate}
          description={description}
          setDescription={setDescription}
          handleSubmit={handleSubmit}
          isUploading={isUploading}
        />

        {uploadResult && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-sm text-green-800">
            ✅ Uploaded: <strong>{uploadResult.topic}</strong>
            <br />
            Preview: {uploadResult.preview.slice(0, 150)}...
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
