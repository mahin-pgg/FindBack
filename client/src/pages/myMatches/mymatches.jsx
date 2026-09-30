import React from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";

import { useGetMyMatches } from "../../hooks/matchesHook/useGetMyMatches.hook.js";
import { useAcceptMatch } from "../../hooks/matchesHook/useAcceptMatch.hook.js";
import { useRejectMatch } from "../../hooks/matchesHook/useRejectMatch.hook.js";
import CreateClaimModal from "../../components/claims/CreateClaimModal.jsx";

import MatchDetailsModal from "../../components/matches/MatchDetailsModal.jsx";

// ─── STATUS STYLES ─────────────────────────────────────────────
const STATUS_STYLES = {
  suggested: "text-purple-600",
  accepted: "text-green-600",
  rejected: "text-red-500",
};

// ─── SKELETON ───────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-xl shadow animate-pulse">
    <div className="h-4 bg-gray-200 w-1/2 mb-2 rounded"></div>
    <div className="h-3 bg-gray-200 w-1/3 mb-2 rounded"></div>
    <div className="h-3 bg-gray-200 w-2/3 rounded"></div>
  </div>
);

const MyMatches = () => {
  // ─── DATA HOOKS ──────────────────────────────────────────────
  const { data, isLoading } = useGetMyMatches();
  const { mutate: acceptMatch } = useAcceptMatch();
  const { mutate: rejectMatch } = useRejectMatch();

  const [claimMatch, setClaimMatch] = React.useState(null);


const matches = data?.data ?? [];
console.log("matches:", matches);
  // ─── UI STATE ────────────────────────────────────────────────
  const [selectedMatch, setSelectedMatch] = React.useState(null);

  // lock scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = selectedMatch ? "hidden" : "auto";
  }, [selectedMatch]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 p-6 mt-10 lg:mt-0">

        <h1 className="text-2xl font-bold mb-6">
          🔍 My Matches
        </h1>

        {/* ───────────────── EMPTY STATE ───────────────── */}
        {!isLoading && matches.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">No matches found yet</p>
            <p className="text-sm">
              Run matching on your items to generate results
            </p>
          </div>
        )}

        {/* ───────────────── LOADING STATE ───────────────── */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ───────────────── MATCH GRID ───────────────── */}
        {!isLoading && matches.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">

            {matches.map((match) => {

            const canAccept =
              (match.isLostUser && !match.lostUserAccepted) ||
              (match.isFoundUser && !match.foundUserAccepted);

            return (

              <div
                key={match._id}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >

                {/* TITLE */}
                <h2 className="font-semibold text-gray-800">
                  {match.lostItemId?.title ?? "Unknown item"}
                </h2>

                <p className="text-sm text-gray-500">
                  📍 {match.lostItemId?.location ?? "—"}
                </p>

                <p className="mt-2 text-sm">
                  Found: {match.foundItemId?.title ?? "—"}
                </p>

                {/* SCORE */}
                <p className="text-green-600 font-bold mt-2">
                  Score: {match.matchScore ?? 0}%
                </p>

                {/* STATUS */}
                <p
                  className={`text-xs mt-1 font-medium ${
                    STATUS_STYLES[match.status] ?? "text-gray-500"
                  }`}
                >
                  {match.status}
                </p>

                <div className="flex gap-3 mt-4 flex-wrap">

                {/* ───────────── ACCEPT / REJECT ───────────── */}
                {match.status === "suggested" && (
                  <>
                    <button
                      onClick={() => acceptMatch(match._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => rejectMatch(match._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

              {/* ───────────── LOST USER: CREATE CLAIM ───────────── */}
              {match.canClaim && (
                <button
                  onClick={() => setClaimMatch(match)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                >
                  Create Claim
                </button>
              )}

              {/* AFTER CLAIM CREATED (LOST USER) */}
              {match.hasClaim && (
                <div className="text-sm text-indigo-600">
                  Claim submitted. Waiting for review.
                </div>
              )}

              {/* ───────────── VIEW DETAILS ───────────── */}
              <button
                onClick={() => setSelectedMatch(match)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
              >
                View Details
              </button>

            </div>

              </div>
              );
            })}

          </div>
        )}

        {/* ───────────────── MATCH DETAILS MODAL ───────────────── */}
        {selectedMatch && (
          <MatchDetailsModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
          />
        )}

        {/* ───────────────── CREATE CLAIM MODAL ───────────────── */}
        {claimMatch && (
          <CreateClaimModal
            match={claimMatch}
            onClose={() => setClaimMatch(null)}
          />
        )}

      </main>
    </div>
  );
};

export default MyMatches;

