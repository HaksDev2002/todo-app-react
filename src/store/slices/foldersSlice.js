import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  folders: [
    { id: 'default', name: 'All Tasks', color: '#6366f1' },
  ],
};

// Load folders from localStorage
const loadFoldersFromStorage = () => {
  try {
    const savedFolders = localStorage.getItem('todoFolders');
    return savedFolders ? JSON.parse(savedFolders) : initialState.folders;
  } catch (error) {
    console.error('Error loading folders from localStorage:', error);
    return initialState.folders;
  }
};

// Save folders to localStorage
const saveFoldersToStorage = (folders) => {
  try {
    localStorage.setItem('todoFolders', JSON.stringify(folders));
  } catch (error) {
    console.error('Error saving folders to localStorage:', error);
  }
};

const foldersSlice = createSlice({
  name: 'folders',
  initialState: {
    ...initialState,
    folders: loadFoldersFromStorage(),
  },
  reducers: {
    addFolder: (state, action) => {
      const newFolder = {
        id: uuidv4(),
        name: action.payload.name,
        color: action.payload.color || '#6366f1',
        createdAt: new Date().toISOString(),
      };
      state.folders.push(newFolder);
      saveFoldersToStorage(state.folders);
    },
    
    updateFolder: (state, action) => {
      const { id, updates } = action.payload;
      const folderIndex = state.folders.findIndex(folder => folder.id === id);
      if (folderIndex !== -1) {
        state.folders[folderIndex] = { ...state.folders[folderIndex], ...updates };
        saveFoldersToStorage(state.folders);
      }
    },
    
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter(folder => folder.id !== action.payload);
      saveFoldersToStorage(state.folders);
    },
  },
});

export const { addFolder, updateFolder, deleteFolder } = foldersSlice.actions;
export default foldersSlice.reducer;