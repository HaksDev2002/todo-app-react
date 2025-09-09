import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  tasks: [],
  searchTerm: "",
  selectedTags: [],
  selectedFolder: null,
};

const loadTasksFromStorage = () => {
  try {
    const savedTasks = localStorage.getItem("todoTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent("tasksUpdated", { detail: tasks }));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    ...initialState,
    tasks: loadTasksFromStorage(),
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        tags: action.payload.tags || [],
        folderId: action.payload.folderId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: state.tasks.length,
      };
      state.tasks.push(newTask);
      saveTasksToStorage(state.tasks);
    },

    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveTasksToStorage(state.tasks);
      }
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.tasks.forEach((task, index) => {
        task.order = index;
      });
      saveTasksToStorage(state.tasks);
    },

    reorderTasks: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedTask = state.tasks[dragIndex];
      state.tasks.splice(dragIndex, 1);
      state.tasks.splice(hoverIndex, 0, draggedTask);

      state.tasks.forEach((task, index) => {
        task.order = index;
      });
      saveTasksToStorage(state.tasks);
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },

    setSelectedFolder: (state, action) => {
      state.selectedFolder = action.payload;
    },

    syncTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  reorderTasks,
  setSearchTerm,
  setSelectedTags,
  setSelectedFolder,
  syncTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
