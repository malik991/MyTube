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
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyVideos from "./pages/MyVideos.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/MyVideos" element={<MyVideos />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ httpOnly: true }}>
      <Provider store={store}>
        <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);
