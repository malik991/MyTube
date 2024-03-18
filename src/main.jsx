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
import DashBoard from "./pages/DashBoard.jsx";
import Profile from "./pages/Profile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import Channel from "./pages/Channel.jsx";
import PlayListPage from "./pages/PlayListPage.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home isWatchHistory={false} />} />
      <Route
        path="/About"
        element={
          <ProtectedLayout authentication={false}>
            <About />
          </ProtectedLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedLayout authentication={false}>
            <Contact />
          </ProtectedLayout>
        }
      />
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
        path="/profile"
        element={
          <ProtectedLayout authentication>
            <Profile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/playlist"
        element={
          <ProtectedLayout authentication>
            <PlayListPage />
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
      <Route
        path="upload-video"
        element={
          <ProtectedLayout authentication>
            <UploadVideo />
          </ProtectedLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout authentication>
            <DashBoard />
          </ProtectedLayout>
        }
      >
        <Route
          path="my-videos"
          element={
            <ProtectedLayout authentication>
              <MyVideos />
            </ProtectedLayout>
          }
        />
        <Route
          path="upload-video"
          element={
            <ProtectedLayout authentication>
              <UploadVideo />
            </ProtectedLayout>
          }
        />
        <Route
          path="change-password"
          element={
            <ProtectedLayout authentication>
              <ChangePassword />
            </ProtectedLayout>
          }
        />
        <Route
          path="watch-history"
          element={
            <ProtectedLayout authentication>
              <Home isWatchHistory={true} />
            </ProtectedLayout>
          }
        />
      </Route>
      <Route path="/channel" element={<Channel />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
    </PersistGate>
  </Provider>
);
