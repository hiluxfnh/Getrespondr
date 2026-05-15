import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-slate-950 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <Sidebar />

      <div className="min-h-screen ml-64">
        <Topbar />

        <main id="main-content" tabIndex={-1} className="p-8 outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}