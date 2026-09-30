import React from "react";
import AdminSidebar from "../../components/sidebar/adminsidebar";

const LogsPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 p-6">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          🧾 Activity Logs
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-indigo-600">1,245</h2>
            <p className="text-gray-500 mt-2">Total Activities</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-green-500">325</h2>
            <p className="text-gray-500 mt-2">Approved Actions</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-yellow-500">78</h2>
            <p className="text-gray-500 mt-2">Pending Reviews</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-red-500">24</h2>
            <p className="text-gray-500 mt-2">Flagged Activities</p>
          </div>

        </div>

        {/* Search + Filter */}
        <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow mb-8 flex flex-col md:flex-row gap-4 justify-between">

          <input
            type="text"
            placeholder="🔍 Search logs..."
            className="flex-1 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <select className="px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-400">
            <option>All Activities</option>
            <option>User Activity</option>
            <option>Claims</option>
            <option>Verification</option>
            <option>Admin Actions</option>
            <option>Flagged</option>
          </select>

        </div>

        {/* Activity Timeline */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-semibold mb-6">
            📌 Recent Activities
          </h2>

          <div className="space-y-5">

            <div className="flex gap-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
              <div className="text-2xl">✔</div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Claim Approved
                </h3>
                <p className="text-gray-500 text-sm">
                  Admin approved claim for <b>Black Backpack</b> by Rahul Kumar
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Today • 10:15 AM
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <div className="text-2xl">📦</div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Item Verified
                </h3>
                <p className="text-gray-500 text-sm">
                  iPhone 14 found item verified by admin
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Today • 11:30 AM
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
              <div className="text-2xl">⚠</div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Suspicious Activity
                </h3>
                <p className="text-gray-500 text-sm">
                  Duplicate claim attempt detected for Wallet item
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Today • 12:05 PM
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
              <div className="text-2xl">✖</div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  Claim Rejected
                </h3>
                <p className="text-gray-500 text-sm">
                  Fake ID verification claim rejected by admin
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Today • 1:20 PM
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
              <div className="text-2xl">👤</div>
              <div>
                <h3 className="font-semibold text-gray-700">
                  New User Registered
                </h3>
                <p className="text-gray-500 text-sm">
                  Simran Kaur created a new account
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Today • 2:10 PM
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Admin Notes */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            📝 Admin Notes
          </h2>

          <div className="space-y-3 text-gray-600">
            <p>• System running normally with no major issues.</p>
            <p>• 3 suspicious claims flagged for manual review.</p>
            <p>• Recovery rate improved by 12% this week.</p>
            <p>• Peak user activity observed between 12 PM – 3 PM.</p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default LogsPage;
