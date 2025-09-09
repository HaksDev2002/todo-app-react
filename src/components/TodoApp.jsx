import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { reorderTasks, syncTasks } from "../store/slices/tasksSlice";
import DeleteConfirmModal from "./DeleteConfirmModal";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import TaskForm from "./TaskForm";

const TodoApp = () => {
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "todoTasks") {
        try {
          const updatedTasks = JSON.parse(e.newValue || "[]");
          dispatch(syncTasks(updatedTasks));
        } catch (error) {
          console.error("Error syncing tasks from storage:", error);
        }
      }
    };

    const handleTasksUpdated = (e) => {
      dispatch(syncTasks(e.detail));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tasksUpdated", handleTasksUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tasksUpdated", handleTasksUpdated);
    };
  }, [dispatch]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = parseInt(active.id.split("-")[1]);
    const overIndex = parseInt(over.id.split("-")[1]);

    if (activeIndex !== overIndex) {
      dispatch(
        reorderTasks({
          dragIndex: activeIndex,
          hoverIndex: overIndex,
        })
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gray-50"
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Sidebar />
        <MainContent />
      </DndContext>

      <TaskForm />
      <DeleteConfirmModal />
    </motion.div>
  );
};

export default TodoApp;
