import React from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { useGetMyClaims } from "../../hooks/claimsHook/useGetMyClaims.hook.js";
import Navbar from "../../components/navbar/navbar.jsx";

// ─── STATUS COLORS ─────────────────────────────
const STATUS_STYLES = {
  pending: "text-yellow-500",
  under_review: "text-indigo-500",
  approved: "text-green-500",
  rejected: "text-red-500",
  completed: "text-emerald-500",
};

function StatusText({ status }) {
  return (
    <span
      className={`font-semibold capitalize ${
        STATUS_STYLES[status] ?? "text-gray-500"
      }`}
    >
      {status?.replace("_", " ") ?? "—"}
    </span>
  );
}

// ─── SKELETON ─────────────────────────────
const Skeleton = () => (
  <div className="bg-white p-5 rounded-xl shadow animate-pulse">
    <div className="h-4 bg-gray-200 w-1/2 mb-3 rounded"></div>
    <div className="h-3 bg-gray-200 w-1/3 mb-2 rounded"></div>
    <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
  </div>
);

const MyClaims = () => {
  const { data, isLoading, isError } = useGetMyClaims();

  // IMPORTANT: backend returns array OR {data: []}
  const claims = data?.data ?? data ?? [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />

      <Sidebar />

      <main className="flex-1 p-6 mt-10 lg:mt-0">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          📦 My Claims
        </h1>

        {/* ERROR */}
        {isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            Failed to load claims
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && claims.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            You haven't made any claims yet.
          </div>
        )}

        {/* CLAIM LIST */}
        {!isLoading && claims.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">

            {claims.map((claim) => (
              <div
                key={claim._id}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow hover:shadow-lg transition"
              >

                {/* ITEM TITLE */}
                <h2 className="text-xl font-semibold text-gray-800">
                  {claim.itemId?.title ?? "Deleted Item"}
                </h2>

                {/* LOCATION */}
                <p className="text-gray-500 text-sm mt-1">
                  📍 {claim.itemId?.location ?? "Unknown location"}
                </p>

                {/* STATUS */}
                <p className="mt-2">
                  Status: <StatusText status={claim.status} />
                </p>

                {/* MESSAGE PREVIEW */}
                {claim.message && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    "{claim.message}"
                  </p>
                )}

                {/* ACTIONS */}
                <div className="mt-4 flex gap-3">

                  <button className="px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                    View Details
                  </button>

                  {claim.status === "pending" && (
                    <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Cancel
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default MyClaims;