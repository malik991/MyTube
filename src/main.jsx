import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { ProtectedLayout } from "./components/index.js";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyVideos from "./pages/MyVideos.jsx";
import { store, persistor } from "./store/store.js";
import { Provider } from "react-redux";
import { UploadVideo } from "./pages/UploadVideo.jsx";
import EditVideo from "./pages/EditVideo.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <ProtectedLayout authentication={false}>
            <Login />
          </ProtectedLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedLayout authentication={false}>
            <SignUp />
          </ProtectedLayout>
        }
      />
      <Route
        path="/my-videos"
        element={
          <ProtectedLayout authentication>
            <MyVideos />
          </ProtectedLayout>
        }
      />
      <Route
        path="/upload-video"
        element={
          <ProtectedLayout authentication>
            <UploadVideo />
          </ProtectedLayout>
        }
      />
      <Route
        path="/upload-video/:videoId"
        element={
          <ProtectedLayout authentication>
            <EditVideo />
          </ProtectedLayout>
        }
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
