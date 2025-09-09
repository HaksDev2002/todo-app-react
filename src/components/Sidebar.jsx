import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Plus,
  Menu,
  X,
  Hash,
  Search,
  ChevronDown,
  CheckSquare,
  Filter,
} from "lucide-react";
import {
  setSelectedFolder,
  setSelectedTags,
  setSearchTerm,
} from "../store/slices/tasksSlice";
import { toggleSidebar, toggleFolderForm } from "../store/slices/uiSlice";
import FolderForm from "./FolderForm";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folders);
  const { tasks, selectedFolder, selectedTags, searchTerm } = useSelector(
    (state) => state.tasks
  );
  const { sidebarOpen, isFolderFormOpen } = useSelector((state) => state.ui);
  const [showFolders, setShowFolders] = useState(true);
  const [showTags, setShowTags] = useState(true);

  // Get all unique tags
  const allTags = [...new Set(tasks.flatMap((task) => task.tags))];

  const handleFolderClick = (folderId) => {
    dispatch(setSelectedFolder(folderId === "default" ? null : folderId));
  };

  const handleTagClick = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(newSelectedTags));
  };

  const getTaskCountForFolder = (folderId) => {
    if (folderId === "default") return tasks.length;
    return tasks.filter((task) => task.folderId === folderId).length;
  };

  const clearFilters = () => {
    dispatch(setSearchTerm(""));
    dispatch(setSelectedTags([]));
    dispatch(setSelectedFolder(null));
  };

  if (!sidebarOpen) {
    return (
      <motion.button
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        onClick={() => dispatch(toggleSidebar())}
        className="fixed top-6 left-6 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl rounded-r-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white rounded-tr-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
                TodoFlow
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks or tags..."
              value={searchTerm}
              maxLength={30} // limit search length
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedTags.length > 0 || selectedFolder) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {(searchTerm ? 1 : 0) +
                      (selectedTags.length > 0 ? selectedTags.length : 0) +
                      (selectedFolder ? 1 : 0)}{" "}
                    filter
                    {(searchTerm ? 1 : 0) +
                      (selectedTags.length > 0 ? selectedTags.length : 0) +
                      (selectedFolder ? 1 : 0) !==
                    1
                      ? "s"
                      : ""}{" "}
                    active
                  </span>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>

              {/* Show active filters */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFolder && (
                  <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                    Folder:{" "}
                    {folders.find((f) => f.id === selectedFolder)?.name ||
                      "Unknown"}
                  </span>
                )}
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full"
                  >
                    Tag: {tag}
                  </span>
                ))}
                {searchTerm && (
                  <span className="px-2 py-1 text-xs bg-green-600 text-white rounded-full border-b-2 border-green-300">
                    Search:{" "}
                    {searchTerm.length > 15
                      ? searchTerm.slice(0, 15) + "..."
                      : searchTerm}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Stats */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-blue-700">
                  {tasks.length}
                </div>
                <div className="text-xs text-blue-700 font-semibold">
                  Total Tasks
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-purple-700">
                  {allTags.length}
                </div>
                <div className="text-xs text-purple-700 font-semibold">
                  Tags
                </div>
              </div>
            </div>
          </div>

          {/* Folders Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => setShowFolders(!showFolders)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                <motion.div
                  animate={{ rotate: showFolders ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
                <Folder className="w-4 h-4" />
                Folders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleFolderForm())}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </motion.button>
            </div>

            <AnimatePresence>
              {showFolders && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {folders
                    .slice()
                    .reverse()
                    .map((folder) => (
                      <motion.button
                        key={folder.id}
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFolderClick(folder.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all duration-200 shadow-sm ${
                          selectedFolder === folder.id ||
                          (selectedFolder === null && folder.id === "default")
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                            : "hover:bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: folder.color }}
                          />
                          <span className="font-medium">{folder.name}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            selectedFolder === folder.id ||
                            (selectedFolder === null && folder.id === "default")
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {getTaskCountForFolder(folder.id)}
                        </span>
                      </motion.button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tags Section */}
          {allTags.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <motion.button
                whileHover={{ x: 2 }}
                onClick={() => setShowTags(!showTags)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mb-4 transition-colors"
              >
                <motion.div
                  animate={{ rotate: showTags ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
                <Hash className="w-4 h-4" />
                Tags
              </motion.button>

              <AnimatePresence>
                {showTags && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    {allTags
                      .slice()
                      .reverse()
                      .map((tag) => (
                        <motion.button
                          key={tag}
                          whileHover={{ x: 4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleTagClick(tag)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-200 shadow-sm ${
                            selectedTags.includes(tag)
                              ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                              : "hover:bg-gray-50 text-gray-700 border border-gray-200"
                          }`}
                        >
                          <Hash
                            className={`w-3 h-3 ${
                              selectedTags.includes(tag)
                                ? "text-white/80"
                                : "text-purple-500"
                            }`}
                          />
                          <span className="font-medium">{tag}</span>
                        </motion.button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-br-2xl">
          <div className="text-xs text-gray-500 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckSquare className="w-3 h-3" />
              TodoFlow v1.0
            </div>
            <div>Professional Task Management</div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>{isFolderFormOpen && <FolderForm />}</AnimatePresence>
    </>
  );
};

export default Sidebar;
