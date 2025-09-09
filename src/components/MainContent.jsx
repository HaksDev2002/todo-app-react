import { motion } from "framer-motion";
import { Filter, Folder as FolderIcon, Plus, Tag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openTaskForm } from "../store/slices/uiSlice";
import TaskList from "./TaskList";

const MainContent = () => {
  const dispatch = useDispatch();
  const { tasks, searchTerm, selectedTags, selectedFolder } = useSelector(
    (state) => state.tasks
  );
  const { folders } = useSelector((state) => state.folders);

  // Filter tasks based on search, tags, and folder
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => task.tags.includes(tag));

    const matchesFolder =
      selectedFolder === null || task.folderId === selectedFolder;

    return matchesSearch && matchesTags && matchesFolder;
  });

  const currentFolder = folders.find((f) => f.id === selectedFolder) || {
    name: "All Tasks",
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {currentFolder.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 md:mt-0">
            <span>
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
            {(searchTerm || selectedTags.length > 0) && (
              <div className="flex items-center gap-1 text-blue-600 font-medium">
                <Filter className="w-4 h-4" />
                <span>Filtered</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded-full flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add Task Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(openTaskForm())}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-hidden">
        <TaskList tasks={filteredTasks} />
      </div>
    </div>
  );
};

export default MainContent;
