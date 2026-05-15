import DashboardLayout from "../layouts/DashboardLayout";

import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";

import {
  ArrowLeft,
  House,
  Users,
  Clock,
  ShieldAlert,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

export default function IncidentDetails() {

  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/incidents");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-black transition"
          >
            <ArrowLeft size={18} />

            Back to incidents
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <House size={16} />
            Landing Page
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">

          <div className="flex items-start justify-between">

            <div>
              <h1 className="text-4xl font-bold">
                Flood in Downtown
              </h1>

              <p className="text-slate-500 mt-2">
                Central District • Reported 5 mins ago
              </p>
            </div>

            <div className="flex gap-3">
              <SeverityBadge severity="Critical" />

              <StatusBadge status="Active" />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-6 mt-8">

            <div className="col-span-2 space-y-6">

              <div className="border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  Incident Description
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  Heavy flooding has affected several streets in the downtown region following intense rainfall over the past two hours. Emergency access is partially blocked and nearby residents have requested evacuation support.
                </p>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  AI Intelligence Summary
                </h2>

                <div className="space-y-4">

                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="font-medium text-red-700">
                      Flood severity expected to increase within 1 hour.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="font-medium text-blue-700">
                      14 duplicate reports merged automatically by AI.
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <p className="font-medium text-orange-700">
                      Medical assistance likely required in adjacent zone.
                    </p>
                  </div>

                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">
                  Incident Timeline
                </h2>

                <div className="space-y-6">

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-2" />

                    <div>
                      <p className="font-medium">
                        Incident reported by citizen
                      </p>

                      <p className="text-sm text-slate-500">
                        5 mins ago
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mt-2" />

                    <div>
                      <p className="font-medium">
                        AI classified severity as Critical
                      </p>

                      <p className="text-sm text-slate-500">
                        4 mins ago
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 mt-2" />

                    <div>
                      <p className="font-medium">
                        Volunteer Team Alpha assigned
                      </p>

                      <p className="text-sm text-slate-500">
                        2 mins ago
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            <div className="space-y-6">

              <div className="border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  Assigned Teams
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <Users className="text-blue-500" />

                    <div>
                      <p className="font-medium">
                        Team Alpha
                      </p>

                      <p className="text-sm text-slate-500">
                        Rescue Operations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="text-green-500" />

                    <div>
                      <p className="font-medium">
                        Team Bravo
                      </p>

                      <p className="text-sm text-slate-500">
                        Medical Support
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  Resources
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-orange-500" />

                    <p>12 Medical Kits</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-blue-500" />

                    <p>3 Rescue Boats</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-green-500" />

                    <p>2 Ambulances</p>
                  </div>

                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  Response Metrics
                </h2>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-500" />

                    <div>
                      <p className="font-medium">
                        Response Time
                      </p>

                      <p className="text-sm text-slate-500">
                        3 minutes
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium">
                      Active Volunteers
                    </p>

                    <p className="text-sm text-slate-500">
                      24 responders deployed
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
