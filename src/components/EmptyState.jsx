import { motion } from "framer-motion";
import { CheckSquare, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { openTaskForm } from "../store/slices/uiSlice";

const EmptyState = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckSquare className="w-12 h-12 text-blue-400" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No tasks found
        </h3>

        <p className="text-gray-600 mb-6 max-w-md">
          Start organizing your work by creating your first task. You can add
          descriptions, tags, and organize them in folders.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(openTaskForm())}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Your First Task
        </motion.button>
      </motion.div>
    </div>
  );
};

export default EmptyState;
