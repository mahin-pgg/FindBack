import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

// Fetches the logged-in user's own items.
// Supported params: page, limit, order, keyword, type, category, status

const fetchMyItems = async (params = {}) => {
  const token = Cookies.get("token");

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}getmyitems`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        page:  Number(cleanParams.page)  || 1,
        limit: Number(cleanParams.limit) || 9,
        order: cleanParams.order         || "desc",
        ...(cleanParams.keyword  && { keyword:  cleanParams.keyword  }),
        ...(cleanParams.type     && { type:     cleanParams.type     }),
        ...(cleanParams.category && { category: cleanParams.category }),
        ...(cleanParams.status   && { status:   cleanParams.status   }),
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch your items");
  }

  return response.json();
  // responseFormatter shape:
  // { data: Item[], pagination: { total, page, limit, totalPages },
  //   summary: { lost, found, pending, approved } }
};

export function useGetMyItems(params) {
  return useQuery({
    queryKey: ["myItems", params],
    queryFn:  () => fetchMyItems(params),
    enabled:  !!params,
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });
}