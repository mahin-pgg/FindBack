import React from "react";
import AdminSidebar from "../../components/sidebar/adminsidebar";
import AdminNavbar from "../../components/navbar/Adminnavbar.jsx";
import { useGetClaims } from "../../hooks/adminHook/useFetchClaims.hook";
import { useApproveClaim } from "../../hooks/claimsHook/useApproveClaim.hook";
import { useRejectClaim } from "../../hooks/claimsHook/useRejectClaim.hook";
import { getMediaUrl } from "../../lib/media.js";

const ClaimsPage = () => {
  const { data, isLoading, error } = useGetClaims();

  const { mutate: approveClaim } = useApproveClaim();
  const { mutate: rejectClaim } = useRejectClaim();

  const [selectedClaim, setSelectedClaim] = React.useState(null);

const [actionType, setActionType] = React.useState(null);

const [reviewNote, setReviewNote] = React.useState("");

  const claims = data?.data || [];

  if (isLoading) {
    return <p className="p-6">Loading claims...</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-red-500">
        {error.message}
      </p>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      {/* Navbar */}
      <AdminNavbar />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-gray-700 mb-6">
          📦 Claims Management
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white/80 p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-orange-500">
              {
                claims.filter(
                  (c) => c.status === "pending"
                ).length
              }
            </h2>

            <p className="text-gray-500 mt-2">
              Pending Claims
            </p>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-green-500">
              {
                claims.filter(
                  (c) => c.status === "approved"
                ).length
              }
            </h2>

            <p className="text-gray-500 mt-2">
              Approved Claims
            </p>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-red-500">
              {
                claims.filter(
                  (c) => c.status === "rejected"
                ).length
              }
            </h2>

            <p className="text-gray-500 mt-2">
              Rejected Claims
            </p>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-sky-700">
              {claims.length}
            </h2>

            <p className="text-gray-500 mt-2">
              Total Claims
            </p>
          </div>

        </div>

        {/* Claim Cards */}
        <div className="space-y-6">

          {claims.map((claim) => (

            <div
              key={claim._id}
              className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow"
            >

              <div className="flex flex-col lg:flex-row justify-between gap-6">

                {/* Left */}
                <div className="flex gap-5">

                  <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-sky-700 to-sky-800 flex items-center justify-center text-white text-4xl shadow">
                    📦
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-gray-700">
                      {claim.itemId?.title || "Unknown Item"}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Claimed by:
                      {" "}
                      {claim.claimedBy?.firstname}
                      {" "}
                      {claim.claimedBy?.lastname}
                    </p>

                    <p className="text-gray-500">
                      Contact:
                      {" "}
                      {claim.contactInfo}
                    </p>

                    <p className="text-gray-500">
                      Message:
                      {" "}
                      {claim.message}
                    </p>

                    <p className="text-sm text-orange-600 font-medium mt-2">
                      Status:
                      {" "}
                      {claim.status}
                    </p>

                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-3 items-center">

                  {claim.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedClaim(claim);
                          setActionType("approve");
                        }}
                        className="px-5 py-2 bg-green-500 text-white rounded-xl"
                      >
                        Approve
                      </button>

                    <button
                      onClick={() => {
                        setSelectedClaim(claim);
                        setActionType("reject");
                      }}
                      className="px-5 py-2 bg-red-500 text-white rounded-xl"
                    >
                      Reject
                    </button>
                    </>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>
          {selectedClaim && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

      <h2 className="text-xl font-bold mb-4">
        {actionType === "approve"
          ? "Approve Claim"
          : "Reject Claim"}
      </h2>

      {[['Lost report', selectedClaim.matchId?.lostItemId], ['Found report', selectedClaim.matchId?.foundItemId || selectedClaim.itemId]].map(([label, item]) => item && (
        <section key={label} className="mb-4 rounded-xl border p-3">
          <h3 className="font-semibold">{label}: {item.title}</h3>
          {item.imageURL && <img src={getMediaUrl(item.imageURL)} alt={item.title} className="my-2 h-36 w-full rounded-lg object-cover" />}
          <p className="text-sm">{item.description}</p>
          <p className="text-xs text-gray-500">{item.location} · {item.category} · {item.type}</p>
        </section>
      ))}

      <p className="mb-3 text-sm">Claimed by {selectedClaim.claimedBy?.firstname || "User"} {selectedClaim.claimedBy?.lastname || ""} · {selectedClaim.contactInfo}</p>

      <textarea
        value={reviewNote}
        onChange={(e) => setReviewNote(e.target.value)}
        placeholder="Enter review note..."
        className="w-full border rounded-xl p-3 h-32 outline-none focus:ring-2 focus:ring-sky-600"
      />

      <div className="flex justify-end gap-3 mt-5">

        <button
          onClick={() => {
            setSelectedClaim(null);
            setReviewNote("");
            setActionType(null);
          }}
          className="px-4 py-2 bg-gray-300 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (actionType === "approve") {
              approveClaim({
                id: selectedClaim._id,
                reviewNote,
              });
            } else {
              rejectClaim({
                id: selectedClaim._id,
                reviewNote,
              });
            }

            setSelectedClaim(null);
            setReviewNote("");
            setActionType(null);
          }}
          className={`px-4 py-2 text-white rounded-xl ${
            actionType === "approve"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          Confirm
        </button>

      </div>

    </div>

  </div>
)}
      </main>
    </div>
  );
};

export default ClaimsPage;
