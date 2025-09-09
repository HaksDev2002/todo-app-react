import { configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./slices/tasksSlice";
import foldersSlice from "./slices/foldersSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
