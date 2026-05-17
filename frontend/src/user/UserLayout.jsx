import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <Navbar />

      <div style={{ minHeight: "80vh" }}>
        <Outlet />
      </div>

      <Footer />
    </>
  );
}

export default UserLayout;