import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../navbar/Topbar";
import ToastContainer from "../common/ToastContainer";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ background: "rgba(0,0,0,0.35)", zIndex: 1020 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="app-main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content eco-bg">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
