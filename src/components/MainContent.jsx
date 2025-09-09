import { motion } from "framer-motion";
import { Filter, Folder as FolderIcon, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { openTaskForm } from "../store/slices/uiSlice";
import TaskList from "./TaskList";

const MainContent = () => {
  const dispatch = useDispatch();
  const { tasks, searchTerm, selectedTags, selectedFolder } = useSelector(
    (state) => state.tasks
  );
  const { folders } = useSelector((state) => state.folders);

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
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-400 px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-2 ml-4">
            <FolderIcon className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {currentFolder.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="font-medium">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </span>
            {(searchTerm || selectedTags.length > 0) && (
              <div className="flex items-center gap-1 text-blue-700 font-medium bg-white border border-blue-200 px-2 py-0.5 rounded-md shadow-sm">
                <Filter className="w-4 h-4" />
                <span>Filtered</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(openTaskForm())}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <TaskList tasks={filteredTasks} />
      </div>
    </div>
  );
};

export default MainContent;
