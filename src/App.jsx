import conf from "./config/viteConfiguration";
import { useState, useEffect } from "react";
import "./App.css";
//import dbServiceObj from "./apiAccess/confYoutubeApi";
import { Header, Footer } from "./components/index";
import { Outlet } from "react-router-dom";

function App() {
  //useEffect(() => {}, []);

  return (
    <div className="min-h-scree flex flex-wrap content-between rounded-xl ">
      <div className="w-full block">
        <Header />
        <main className="my-2">
          {" "}
          <Outlet />{" "}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
