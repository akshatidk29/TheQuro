/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDocStore } from "../Stores/useDocStore";
import {
  FileText,
  Edit3,
  Trash2,
  Save,
  X,
  Calendar,
  Tag,
  FileIcon,
  FolderOpen,
  Search,
  Filter,
  MoreVertical,
  Check,
  AlertCircle
} from "lucide-react";

const DocumentsPage = () => {
  const { getUserDocs, documents, isLoading, updateDocument, deleteDocument } = useDocStore();
  const [editStates, setEditStates] = useState({});
  const [editingCourse, setEditingCourse] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

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

  // Filter documents based on search and course selection
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === "all" || doc.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const groupedDocs = groupByCourse(filteredDocs);
  const allCourses = [...new Set(documents.map(doc => doc.course))];

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

  const getFileTypeIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'txt':
        return <FileText className="w-5 h-5 text-gray-500" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Library</h1>
              <p className="mt-2 text-gray-600">
                Manage and organize your uploaded documents for TheQuro
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
                </span>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents, topics, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-48"
              >
                <option value="all">All Courses</option>
                {allCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Content */}
        {documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Start building your knowledge base by uploading your first document to TheQuro.
            </p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching documents</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedDocs).map(([course, courseDocs]) => {
              const editing = editingCourse[course] !== undefined;

              return (
                <div key={course} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Course Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      {editing ? (
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            value={editingCourse[course]}
                            onChange={(e) =>
                              setEditingCourse((prev) => ({
                                ...prev,
                                [course]: e.target.value,
                              }))
                            }
                            className="text-xl font-semibold text-gray-900 bg-white px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1"
                          />
                          <button
                            onClick={() =>
                              handleCourseChange(course, editingCourse[course])
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingCourse((prev) => {
                                const newState = { ...prev };
                                delete newState[course];
                                return newState;
                              });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900">{course}</h2>
                              <p className="text-sm text-gray-600">
                                {courseDocs.length} {courseDocs.length === 1 ? 'document' : 'documents'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCourseEdit(course)}
                            className="inline-flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Course
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Documents Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow duration-200"
                            >
                              {/* Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-1">
                                  {getFileTypeIcon(doc.fileType)}
                                  <div className="flex-1 min-w-0">
                                    {isEditing ? (
                                      <input
                                        value={editData.name}
                                        onChange={(e) =>
                                          handleInputChange(doc._id, "name", e.target.value)
                                        }
                                        className="w-full text-sm font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                    ) : (
                                      <h3 className="text-sm font-medium text-gray-900 truncate">
                                        {doc.name}
                                      </h3>
                                    )}
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs uppercase">
                                  {doc.fileType}
                                </span>
                              </div>

                              {/* Topic */}
                              <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                                  Topic
                                </label>
                                {isEditing ? (
                                  <input
                                    value={editData.topic}
                                    onChange={(e) =>
                                      handleInputChange(doc._id, "topic", e.target.value)
                                    }
                                    className="w-full text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  <p className="text-sm text-gray-800">{doc.topic}</p>
                                )}
                              </div>

                              {/* Description */}
                              <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                                  Description
                                </label>
                                {isEditing ? (
                                  <textarea
                                    value={editData.description}
                                    onChange={(e) =>
                                      handleInputChange(doc._id, "description", e.target.value)
                                    }
                                    rows={2}
                                    className="w-full text-sm text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                                  />
                                ) : (
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {doc.description}
                                  </p>
                                )}
                              </div>

                              {/* Date */}
                              <div className="flex items-center text-xs text-gray-500 mb-3">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>{formatDate(doc.createdAt)}</span>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-end gap-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSave(doc._id)}
                                      className="px-2.5 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                                    >
                                      <Save className="w-3 h-3 inline mr-1" />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => toggleEdit(doc)}
                                      className="px-2.5 py-1.5 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition"
                                    >
                                      <X className="w-3 h-3 inline mr-1" />
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => toggleEdit(doc)}
                                      className="px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 rounded text-xs"
                                    >
                                      <Edit3 className="w-3 h-3 inline mr-1" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(doc._id)}
                                      className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded text-xs"
                                    >
                                      <Trash2 className="w-3 h-3 inline mr-1" />
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );

                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;