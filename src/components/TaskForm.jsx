import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { Hash, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { addTask, updateTask } from "../store/slices/tasksSlice";
import { closeTaskForm } from "../store/slices/uiSlice";

const TaskSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  folderId: Yup.string().nullable(),
});

const TaskForm = () => {
  const dispatch = useDispatch();
  const { isTaskFormOpen, editingTask } = useSelector((state) => state.ui);
  const { folders } = useSelector((state) => state.folders);
  const { selectedFolder, tasks } = useSelector((state) => state.tasks);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState("");

  const allExistingTags = [...new Set(tasks.flatMap((task) => task.tags))];

  useEffect(() => {
    if (editingTask) {
      setTags(editingTask.tags || []);
    } else {
      setTags([]);
    }
    setTagInput("");
    setTagError("");
  }, [editingTask, isTaskFormOpen]);

  if (!isTaskFormOpen) return null;

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();

    if (!tag) {
      setTagError("Tag cannot be empty");
      return;
    }

    const tagExistsInCurrent = tags.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );
    const tagExistsGlobally = allExistingTags.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );

    if (tagExistsInCurrent || (!editingTask && tagExistsGlobally)) {
      setTagError("Tag already exists in project");
      return;
    }

    setTags([...tags, tag]);
    setTagInput("");
    setTagError("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingTask ? "Edit Task" : "Add New Task"}
              </h2>
              <button
                onClick={() => dispatch(closeTaskForm())}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <Formik
              initialValues={{
                title: editingTask?.title || "",
                description: editingTask?.description || "",
                folderId: editingTask?.folderId || selectedFolder || "",
              }}
              validationSchema={TaskSchema}
              onSubmit={(values) => {
                const taskData = {
                  ...values,
                  tags,
                };

                if (editingTask) {
                  dispatch(
                    updateTask({
                      id: editingTask.id,
                      updates: taskData,
                    })
                  );
                } else {
                  dispatch(addTask(taskData));
                }

                dispatch(closeTaskForm());
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <Field
                      type="text"
                      name="title"
                      placeholder="Enter task title..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      placeholder="Enter task description..."
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Folder
                    </label>
                    <Field
                      as="select"
                      name="folderId"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-40 overflow-y-auto"
                    >
                      <option value="">No folder</option>
                      {folders
                        .filter((f) => f.id !== "default")
                        .map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value);
                          setTagError("");
                        }}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add tag..."
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {tagError && (
                      <div className="text-red-500 text-sm mb-2">
                        {tagError}
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <motion.span
                            key={tag}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-purple-600 hover:text-purple-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => dispatch(closeTaskForm())}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {editingTask ? "Update Task" : "Add Task"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaskForm;
