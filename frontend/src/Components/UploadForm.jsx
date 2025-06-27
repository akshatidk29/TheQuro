import React from "react";

const InputField = ({ label, value, setValue, type = "text", required = true }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required={required}
      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const TextArea = ({ label, value, setValue }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      rows={3}
      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const UploadForm = ({
  file,
  setFile,
  course,
  setCourse,
  topic,
  setTopic,
  name,
  setName,
  date,
  setDate,
  description,
  setDescription,
  handleSubmit,
  isUploading,
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (Image or PDF)</label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full px-3 py-2 rounded-xl border border-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Course" value={course} setValue={setCourse} />
        <InputField label="Topic" value={topic} setValue={setTopic} />
        <InputField label="Note Name" value={name} setValue={setName} />
        <InputField label="Date" type="date" value={date} setValue={setDate} />
      </div>

      <TextArea label="Description" value={description} setValue={setDescription} />

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold"
      >
        {isUploading ? "Uploading..." : "Upload & Extract"}
      </button>
    </form>
  );
};

export default UploadForm;
