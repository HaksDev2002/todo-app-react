import { motion } from "framer-motion";
import { Folder, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFolder } from "../store/slices/foldersSlice";
import { toggleFolderForm } from "../store/slices/uiSlice";

const FolderForm = () => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folders);
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Folder name is required");
      return;
    }

    if (
      folders.some((f) => f.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      setError("Folder already exists");
      return;
    }

    dispatch(addFolder({ name: trimmedName, color: selectedColor }));

    setName("");
    setSelectedColor("#6366f1");
    setError("");
    dispatch(toggleFolderForm());
  };

  const handleCancel = () => {
    setName("");
    setSelectedColor("#6366f1");
    setError("");
    dispatch(toggleFolderForm());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Folder className="w-5 h-5" />
              New Folder
            </h2>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                maxLength={30} // max length of folder name
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter folder name..."
                autoFocus
              />

              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Color
              </label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-16 h-10 p-0 border-0 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default FolderForm;
