import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "./store/themeSlice";
import { Footer, SidePanel } from "./components/index";
import { Outlet } from "react-router-dom";
import "./App.css";
import "daisyui/dist/full.css";
import ResponsiveAppBar from "./components/header/ResponsiveAppBar";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.state);
  const themeMode = useSelector((state) => state.theme.themeMode);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("logged useEffect app.jsx");
    // document.querySelector("html").classList.remove("light", "dark");
    // document.querySelector("html").classList.add(themeMode);
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  const handleChange = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen flex flex-col rounded-xl relative">
      {/* Theme Toggle Button */}
      <div className="top-0 right-0 p-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            onChange={handleChange}
            checked={themeMode === "dark"}
            type="checkbox"
            value=""
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            Toggle Theme
          </span>
        </label>
      </div>
      <div className="w-full block">
        <div className="w-full">
          <ResponsiveAppBar />
        </div>
        <main className="my-2 flex-grow">
          {isAuthenticated && <SidePanel />}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
