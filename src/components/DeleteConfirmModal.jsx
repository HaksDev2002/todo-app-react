import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../store/slices/tasksSlice";
import { closeDeleteConfirm } from "../store/slices/uiSlice";

const DeleteConfirmModal = () => {
  const dispatch = useDispatch();
  const { deleteConfirmModal } = useSelector((state) => state.ui);

  const handleConfirm = () => {
    if (deleteConfirmModal) {
      dispatch(deleteTask(deleteConfirmModal.id));
      dispatch(closeDeleteConfirm());
    }
  };

  const handleCancel = () => {
    dispatch(closeDeleteConfirm());
  };

  if (!deleteConfirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Task
                </h3>
                <p className="text-gray-600 mt-1">
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="font-medium text-gray-900">
                {deleteConfirmModal.title}
              </p>
              {deleteConfirmModal.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {deleteConfirmModal.description}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Task
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DeleteConfirmModal;
