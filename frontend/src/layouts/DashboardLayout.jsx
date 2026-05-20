import { createContext, useContext, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const LayoutContext = createContext({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  toggleSidebar: () => {},
});

export function useLayout() {
  return useContext(LayoutContext);
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const layoutValue = {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar: () => setSidebarOpen((current) => !current),
  };

  return (
    <LayoutContext.Provider value={layoutValue}>
      <div className="min-h-screen overflow-x-hidden bg-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        ) : null}

        <Sidebar />

        <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">
          <Topbar />

          <main
            id="main-content"
            tabIndex={-1}
            className="min-w-0 flex-1 p-4 outline-none sm:p-6 lg:p-8"
          >
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
