import DashboardLayout from "../layouts/DashboardLayout";

import incidents from "../assets/incidents";

import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";

import { useNavigate } from "react-router-dom";

export default function Incidents() {
    const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Incident Management
            </h1>

            <p className="text-slate-500 mt-1">
              Monitor and manage active incidents
            </p>
          </div>

          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
            + Report Incident
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search incidents..."
              className="border border-slate-200 rounded-xl px-4 py-3 w-80 outline-none"
            />

            <div className="flex gap-3">
              <button className="border border-slate-200 px-4 py-2 rounded-xl">
                Filter
              </button>

              <button className="border border-slate-200 px-4 py-2 rounded-xl">
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-4">
                    Incident
                  </th>

                  <th className="pb-4">
                    Location
                  </th>

                  <th className="pb-4">
                    Severity
                  </th>

                  <th className="pb-4">
                    Status
                  </th>

                  <th className="pb-4">
                    Reported By
                  </th>

                  <th className="pb-4">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incident) => (
                    <tr
                        key={incident.id}
                        onClick={()=>
                            navigate(`/incidents/${incident.id}`)
                        }
                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                    >
                        
                    <td className="py-5 font-medium">
                      {incident.title}
                    </td>

                    <td className="py-5">
                      {incident.location}
                    </td>

                    <td className="py-5">
                      <SeverityBadge
                        severity={incident.severity}
                      />
                    </td>

                    <td className="py-5">
                      <StatusBadge
                        status={incident.status}
                      />
                    </td>

                    <td className="py-5">
                      {incident.reportedBy}
                    </td>

                    <td className="py-5 text-slate-500">
                      {incident.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}