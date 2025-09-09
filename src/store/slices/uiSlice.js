import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isTaskFormOpen: false,
  editingTask: null,
  deleteConfirmModal: null,
  isFolderFormOpen: false,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTaskForm: (state) => {
      state.isTaskFormOpen = true;
      state.editingTask = null;
    },
    
    closeTaskForm: (state) => {
      state.isTaskFormOpen = false;
      state.editingTask = null;
    },
    
    editTask: (state, action) => {
      state.editingTask = action.payload;
      state.isTaskFormOpen = true;
    },
    
    openDeleteConfirm: (state, action) => {
      state.deleteConfirmModal = action.payload;
    },
    
    closeDeleteConfirm: (state) => {
      state.deleteConfirmModal = null;
    },
    
    toggleFolderForm: (state) => {
      state.isFolderFormOpen = !state.isFolderFormOpen;
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const {
  openTaskForm,
  closeTaskForm,
  editTask,
  openDeleteConfirm,
  closeDeleteConfirm,
  toggleFolderForm,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;