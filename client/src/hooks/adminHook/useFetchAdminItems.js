import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

// Matches getAdminItemsProvider exactly.
// All params are optional — provider defaults status to "pending" when omitted.
//
// Supported params:
//   page, limit, order
//   keyword           — searches title, description, keywords[]
//   category          — "wallet" | "phone" | "bag" | "id" | "electronics" | "others"
//   type              — "lost" | "found"
//   status            — "pending" | "approved" | "rejected" | "claimed" | "closed"
//   fromDate, toDate  — ISO strings, filters item's date field
//   location          — text search on location field
//   isFlagged         — true/false
//   verifiedByAdmin   — true/false
//   postedBy          — ObjectId string
//   lat, lng, radius  — geo filter (radius in km)

const fetchAdminItems = async (params = {}) => {
  const token = Cookies.get("token");

  // Strip undefined/null/empty-string keys so the backend
  // doesn't receive blank filter values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}getadminitems`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        page:  Number(cleanParams.page)  || 1,
        limit: Number(cleanParams.limit) || 10,
        order: cleanParams.order || "desc",
        ...cleanParams,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch admin items");
  }

  return response.json();
  // Returns: { message, data: Item[], meta: { total, page, limit, totalPages },
  //            summary: { pending, approved, rejected, claimed, closed, flagged, total } }
};

export function useFetchAdminItems(params) {
  return useQuery({
    queryKey: ["adminItems", params],
    queryFn:  () => fetchAdminItems(params),

    enabled: !!params,

    // 30s stale — verification page doesn't need real-time
    staleTime: 30 * 1000,

    // keep previous page data while next page loads (smooth pagination)
    placeholderData: (previousData) => previousData,
  });
}