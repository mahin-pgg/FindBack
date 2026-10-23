import { useState } from "react";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { useGetMyClaims } from "../../hooks/claimsHook/useGetMyClaims.hook.js";
import { getMediaUrl } from "../../lib/media.js";

const STATUS_STYLES = {
  pending: "text-orange-600", under_review: "text-sky-700",
  approved: "text-green-600", rejected: "text-red-600", completed: "text-emerald-600",
};

async function fetchNotifications() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}notifications/my`, {
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  });
  if (!response.ok) throw new Error("Unable to load notifications");
  return response.json();
}

function itemCard(item, label) {
  if (!item) return null;
  return (
    <section className="rounded-xl border p-4 space-y-2">
      <h3 className="font-semibold">{label}: {item.title || "Item details unavailable"}</h3>
      {item.imageURL && <img src={getMediaUrl(item.imageURL)} alt={item.title || label} className="h-40 w-full rounded-lg object-cover" />}
      <p>{item.description || "No description"}</p>
      <p className="text-sm text-gray-500">{item.type || ""} · {item.location || "Location unavailable"} · {item.category || ""}</p>
    </section>
  );
}

const MyClaims = () => {
  const { data, isLoading, isError } = useGetMyClaims();
  const { data: notificationData } = useQuery({ queryKey: ["notifications"], queryFn: fetchNotifications });
  const [selectedClaim, setSelectedClaim] = useState(null);
  const claimData = Array.isArray(data?.data) ? data.data : data?.data?.data;
  const claims = Array.isArray(claimData) ? claimData : Array.isArray(data) ? data : [];
  const notificationPayload = notificationData?.data;
  const notifications = Array.isArray(notificationPayload)
    ? notificationPayload
    : Array.isArray(notificationPayload?.data) ? notificationPayload.data : [];
  const claimNotifications = notifications.filter((notification) => notification.type === "claim_update");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-sky-100">
      <Navbar /><Sidebar />
      <main className="flex-1 p-6 mt-10 lg:mt-0">
        <h1 className="mb-6 text-3xl font-bold text-gray-700">📦 My Claims</h1>
        {claimNotifications.length > 0 && (
          <section className="mb-6 space-y-2" aria-label="Claim updates">
            {claimNotifications.map((notification) => (
              <article key={notification._id} className="rounded-xl border border-sky-200 bg-white p-4">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <time className="text-xs text-gray-400">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}</time>
              </article>
            ))}
          </section>
        )}
        {isError && <p className="mb-4 rounded bg-red-50 p-3 text-red-600">Failed to load claims.</p>}
        {isLoading ? <p>Loading claims…</p> : claims.length === 0 ? (
          <p className="text-gray-500">You haven’t made any claims yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {claims.map((claim) => (
              <article key={claim._id || claim.id} className="rounded-2xl bg-white/90 p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-800">{claim.itemId?.title || "Deleted item"}</h2>
                <p className="mt-1 text-sm text-gray-500">📍 {claim.itemId?.location || "Unknown location"}</p>
                <p className="mt-2">Status: <span className={`font-semibold capitalize ${STATUS_STYLES[claim.status] || "text-gray-500"}`}>{claim.status?.replaceAll("_", " ") || "—"}</span></p>
                {claim.reviewNote && <p className="mt-2 rounded-lg bg-sky-50 p-3 text-sm"><strong>Admin note:</strong> {claim.reviewNote}</p>}
                <button type="button" onClick={() => setSelectedClaim(claim)} className="mt-4 rounded-lg bg-sky-700 px-4 py-2 text-white hover:bg-sky-800">View Details</button>
              </article>
            ))}
          </div>
        )}
        {selectedClaim && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedClaim(null)}>
            <section role="dialog" aria-modal="true" aria-label="Claim details" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold">Claim details</h2>
                <button type="button" onClick={() => setSelectedClaim(null)} className="rounded px-3 py-1 text-gray-600 hover:bg-gray-100">Close</button>
              </div>
              {itemCard(selectedClaim.matchId?.lostItemId, "Lost report")}
              {itemCard(selectedClaim.matchId?.foundItemId || selectedClaim.itemId, "Found/claimed report")}
              <section className="rounded-xl bg-gray-50 p-4">
                <p><strong>Claim message:</strong> {selectedClaim.message || "—"}</p>
                <p className="mt-2"><strong>Contact:</strong> {selectedClaim.contactInfo || "—"}</p>
                <p className="mt-2"><strong>Status:</strong> {selectedClaim.status || "—"}</p>
                {selectedClaim.reviewNote && <p className="mt-2"><strong>Admin review note:</strong> {selectedClaim.reviewNote}</p>}
                {selectedClaim.createdAt && <p className="mt-2 text-sm text-gray-500">Submitted {new Date(selectedClaim.createdAt).toLocaleString()}</p>}
              </section>
              {selectedClaim.proofImages?.map((image, index) => <img key={`${image}-${index}`} src={getMediaUrl(image)} alt={`Claim proof ${index + 1}`} className="max-h-72 rounded-xl object-contain" />)}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyClaims;
