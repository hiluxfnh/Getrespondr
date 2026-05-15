import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="min-h-screen ml-64">
        <Topbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}