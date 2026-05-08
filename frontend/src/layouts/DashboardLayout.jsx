import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="flex bg-slate-100">
      <Sidebar />

      <div className="flex-1 min-h-screen">
        <Topbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}