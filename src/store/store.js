import { configureStore } from "@reduxjs/toolkit";
import foldersSlice from "./slices/foldersSlice";
import tasksSlice from "./slices/tasksSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksSlice,
    folders: foldersSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
