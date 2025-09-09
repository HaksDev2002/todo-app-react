import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Edit, Trash2, GripVertical, Hash, Calendar } from "lucide-react";
import { editTask, openDeleteConfirm } from "../store/slices/uiSlice";

const TaskItem = ({ task, index }) => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folders);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `task-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const taskFolder = folders.find((f) => f.id === task.folderId);

  const handleEdit = () => {
    dispatch(editTask(task));
  };

  const handleDelete = () => {
    dispatch(openDeleteConfirm(task));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 ${
        isDragging
          ? "shadow-2xl rotate-2 scale-105 z-50"
          : "shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 mt-1 p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 break-words">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-3 break-words">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                title="Edit task"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Folder */}
              {taskFolder && taskFolder.id !== "default" && (
                <div className="flex items-center">
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: taskFolder.color }}
                  />
                  <span className="text-xs text-gray-500">
                    {taskFolder.name}
                  </span>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
