//import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Combine multiple slices into a rootReducer
// const rootReducer = combineReducers({
//   auth: authSlice,
//   //another: anotherSlice,
//   // Add more slices as needed
// });
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Set to true during development to check non-serialized action
    }),
});

const persistor = persistStore(store);

export { store, persistor }; //
