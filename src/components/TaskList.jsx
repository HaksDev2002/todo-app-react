import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import EmptyState from "./EmptyState";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  const taskIds = sortedTasks.map((task, index) => `task-${index}`);

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          <AnimatePresence>
            {sortedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <TaskItem task={task} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskList;
