import conf from "./config/viteConfiguration";
import { useState, useEffect } from "react";
import "./App.css";
//import dbServiceObj from "./apiAccess/confYoutubeApi";
import { Header, Footer, SidePanel } from "./components/index";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.state);
  //const location = useLocation();
  //useEffect(() => {}, []);

  return (
    <div className="min-h-scree flex flex-wrap content-between rounded-xl ">
      <div className="w-full block">
        <Header />
        <main className="my-2">
          {isAuthenticated && <SidePanel />}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
