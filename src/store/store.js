import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import snackbarSlice from "./snackbarSlice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import playListSlice from "./playListSlice";

// Combine multiple slices into a rootReducer
const rootReducer = combineReducers({
  auth: authSlice,
  snackbar: snackbarSlice,
  playlist: playListSlice,
  //another: anotherSlice,
  // Add more slices as needed
});
const persistConfig = {
  key: "root",
  storage,
  //whitelist: ['auth'], // Only persist the 'auth' slice
  blacklist: ["playlist"], // Uncomment this line to exclude the 'snackbar' slice from persistence
};

const persistedAuthReducer = persistReducer(persistConfig, rootReducer);
//const persistedSnackbarReducer = persistReducer(persistConfig, snackbarSlice);

// const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//     //snackbar: persistedSnackbarReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       }, // Set to true during development to check non-serialized action
//     }),
// });

const store = configureStore({
  reducer: persistedAuthReducer, // Pass persistedAuthReducer as the root reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }, // Set to true during development to check non-serialized action
    }),
});

const persistor = persistStore(store);

export { store, persistor }; //
