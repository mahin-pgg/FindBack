import React from "react";
import AdminSidebar from "../../components/sidebar/adminsidebar";
import AdminNavbar from "../../components/navbar/Adminnavbar";
import { useAdminDashboard } from "../../hooks/adminHook/adminDashboard";
import { useApproveClaim } from "../../hooks/claimsHook/useApproveClaim.hook";
import { useRejectClaim } from "../../hooks/claimsHook/useRejectClaim.hook";
import { useBlockUser } from "../../hooks/useBlockUser.hook";

// ─── Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

// ─── Progress bar ─────────────────────────────────────────────────────
function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-sm text-gray-600">{label}</p>
        <span className="text-xs font-semibold text-gray-500">
          {value?.toFixed(1) ?? 0}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-700`}
          style={{ width: `${Math.min(value ?? 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminDashboard();
  const { mutate: approveClaim } = useApproveClaim();
  const { mutate: rejectClaim  } = useRejectClaim();
  const { mutate: blockUser    } = useBlockUser();

  const stats     = data?.data?.stats     ?? {};
  const analytics = data?.data?.analytics ?? {};
  const users     = data?.data?.users     ?? [];
  const claims    = data?.data?.claims    ?? [];
  const logs      = data?.data?.logs      ?? [];

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <AdminNavbar />
      <AdminSidebar />

      <main className="flex-1 min-w-0 p-4 md:p-6 space-y-6">

        {/* ── Heading ── */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700">
          👨‍💼 Admin Dashboard
        </h1>

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm">
            ⚠️ {error.message}
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: "Total Items",    value: stats.totalItems,    color: "text-indigo-600" },
            { label: "Recovered",      value: stats.recovered,     color: "text-green-600"  },
            { label: "Pending Claims", value: stats.pendingClaims, color: "text-yellow-500" },
            { label: "Blocked Users",  value: stats.blockedUsers,  color: "text-red-500"    },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/80 backdrop-blur-lg p-4 md:p-5 rounded-2xl shadow text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-14 mx-auto" />
              ) : (
                <h2 className={`text-2xl md:text-3xl font-bold ${color}`}>{value ?? 0}</h2>
              )}
              <p className="text-gray-500 text-xs md:text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Analytics ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">📊 Analytics Overview</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => <Skeleton key={n} className="h-6 rounded-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              <ProgressBar label="Lost Items"      value={analytics.lostPercent}  color="bg-red-500"    />
              <ProgressBar label="Found Items"     value={analytics.foundPercent} color="bg-green-500"  />
              <ProgressBar label="Approved Claims" value={analytics.claimPercent} color="bg-indigo-500" />
            </div>
          )}
        </div>

        {/* ── Users table ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">👥 Users</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => <Skeleton key={n} className="h-12 rounded-xl" />)}
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm">No users found.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
              <table className="w-full text-left text-sm min-w-[480px]">
                <thead>
                  <tr className="border-b text-gray-500 text-xs uppercase tracking-wide">
                    <th className="p-2 pb-3">Name</th>
                    <th className="pb-3 hidden sm:table-cell">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-2 font-medium text-gray-700 max-w-[120px] truncate">
                        {user.firstname} {user.lastname}
                      </td>
                      <td className="text-gray-500 hidden sm:table-cell text-xs truncate max-w-[150px]">
                        {user.email}
                      </td>
                      <td className="capitalize text-xs text-gray-500">{user.role}</td>
                      <td>
                        <span className={`text-xs font-semibold ${user.isBlocked ? "text-red-500" : "text-green-600"}`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td>
                        {user.role !== "admin" ? (
                          <button
                            onClick={() => blockUser(user._id)}
                            className={`px-3 py-1 text-white text-xs rounded-lg transition ${
                              user.isBlocked
                                ? "bg-indigo-500 hover:bg-indigo-600"
                                : "bg-red-500 hover:bg-red-600"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Claims ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">📦 Claim Requests</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => <Skeleton key={n} className="h-20 rounded-xl" />)}
            </div>
          ) : claims.length === 0 ? (
            <p className="text-gray-400 text-sm">No pending claims.</p>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => (
                <div
                  key={claim._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-700 text-sm truncate">
                      {claim.itemId?.title ?? "—"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Claimed by: {claim.claimedBy?.firstname ?? "Unknown"}
                    </p>
                    <span className={`text-xs font-medium capitalize mt-1 inline-block ${
                      claim.status === "approved" ? "text-green-500"
                      : claim.status === "rejected" ? "text-red-500"
                      : "text-yellow-500"
                    }`}>
                      {claim.status}
                    </span>
                  </div>

                  {claim.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => approveClaim(claim._id)}
                        className="px-4 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectClaim(claim._id)}
                        className="px-4 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Logs ── */}
        <div className="bg-white/80 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow">
          <h2 className="text-lg md:text-xl font-semibold mb-4">🧾 Activity Logs</h2>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => <Skeleton key={n} className="h-5 rounded" />)}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-gray-400 text-sm">No logs available.</p>
          ) : (
            <ul className="space-y-2 text-gray-600 text-sm">
              {logs.map((log, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 text-indigo-400 shrink-0">›</span>
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;