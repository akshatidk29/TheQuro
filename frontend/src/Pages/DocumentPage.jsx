import { useEffect, useState } from "react";
import { useDocStore } from "../Stores/useDocStore";

const DocumentsPage = () => {
  const { getUserDocs, documents, isLoading, updateDocument, deleteDocument } = useDocStore();
  const [editStates, setEditStates] = useState({});
  const [editingCourse, setEditingCourse] = useState({});

  useEffect(() => {
    getUserDocs();
  }, []);

  const groupByCourse = (docs) => {
    return docs.reduce((acc, doc) => {
      if (!acc[doc.course]) acc[doc.course] = [];
      acc[doc.course].push(doc);
      return acc;
    }, {});
  };

  const groupedDocs = groupByCourse(documents);

  const toggleEdit = (doc) => {
    setEditStates((prev) => ({
      ...prev,
      [doc._id]: prev[doc._id]
        ? undefined
        : { name: doc.name, topic: doc.topic, description: doc.description },
    }));
  };

  const handleInputChange = (docId, field, value) => {
    setEditStates((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (docId) => {
    const edited = editStates[docId];
    if (edited) {
      await updateDocument(docId, edited);
      setEditStates((prev) => {
        const newState = { ...prev };
        delete newState[docId];
        return newState;
      });
    }
  };

  const handleDelete = async (docId) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(docId);
    }
  };

  const handleCourseEdit = (courseName) => {
    setEditingCourse((prev) => ({
      ...prev,
      [courseName]: courseName,
    }));
  };

  const handleCourseChange = async (oldCourse, newCourse) => {
    const docsToUpdate = groupedDocs[oldCourse];
    for (const doc of docsToUpdate) {
      await updateDocument(doc._id, { course: newCourse });
    }

    // Clear course editing state
    setEditingCourse((prev) => {
      const newState = { ...prev };
      delete newState[oldCourse];
      return newState;
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📄 Your Uploaded Documents</h2>

      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        Object.entries(groupedDocs).map(([course, courseDocs]) => {
          const editing = editingCourse[course] !== undefined;
          return (
            <div key={course} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {editing ? (
                  <>
                    <input
                      value={editingCourse[course]}
                      onChange={(e) =>
                        setEditingCourse((prev) => ({
                          ...prev,
                          [course]: e.target.value,
                        }))
                      }
                      className="text-xl font-semibold text-indigo-700 bg-gray-100 px-2 py-1 rounded"
                    />
                    <button
                      onClick={() =>
                        handleCourseChange(course, editingCourse[course])
                      }
                      className="text-sm text-green-600 hover:underline"
                    >
                      ✅ Update Course
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-indigo-700">
                      📘 {course}
                    </h3>
                    <button
                      onClick={() => handleCourseEdit(course)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      ✏️ Edit Course
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courseDocs
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((doc) => {
                    const isEditing = !!editStates[doc._id];
                    const editData = editStates[doc._id] || {};

                    return (
                      <div
                        key={doc._id}
                        className="border p-4 rounded-xl shadow bg-white transition hover:shadow-md"
                      >
                        <div className="flex justify-between items-center mb-2">
                          {isEditing ? (
                            <input
                              value={editData.name}
                              onChange={(e) =>
                                handleInputChange(
                                  doc._id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="bg-gray-100 px-2 py-1 rounded w-full"
                            />
                          ) : (
                            <h4 className="text-lg font-semibold">
                              {doc.name}
                            </h4>
                          )}
                          <span className="text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded-md capitalize ml-2">
                            {doc.fileType}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium text-gray-800">
                            Topic:
                          </span>{" "}
                          {isEditing ? (
                            <input
                              value={editData.topic}
                              onChange={(e) =>
                                handleInputChange(
                                  doc._id,
                                  "topic",
                                  e.target.value
                                )
                              }
                              className="bg-gray-100 px-2 py-1 rounded w-full"
                            />
                          ) : (
                            doc.topic
                          )}
                        </p>

                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-800">
                            Description:
                          </span>{" "}
                          {isEditing ? (
                            <textarea
                              value={editData.description}
                              onChange={(e) =>
                                handleInputChange(
                                  doc._id,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                              className="bg-gray-100 px-2 py-1 rounded w-full"
                            />
                          ) : (
                            doc.description
                          )}
                        </p>

                        <div className="text-xs text-gray-500 mb-2">
                          <p>
                            Uploaded:{" "}
                            {new Date(doc.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                          <p>File ID: {doc._id}</p>
                        </div>

                        <div className="flex justify-end space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave(doc._id)}
                                className="text-green-600 hover:underline text-sm"
                              >
                                💾 Save
                              </button>
                              <button
                                onClick={() => toggleEdit(doc)}
                                className="text-red-500 hover:underline text-sm"
                              >
                                ❌ Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleEdit(doc)}
                                className="text-blue-600 hover:underline text-sm"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(doc._id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                🗑️ Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DocumentsPage;
