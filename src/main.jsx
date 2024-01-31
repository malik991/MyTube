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
import { ProtectedLayout } from "./components/index.js";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyVideos from "./pages/MyVideos.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";

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
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
    </Provider>
  </React.StrictMode>
);
