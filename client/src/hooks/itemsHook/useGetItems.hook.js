import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchItems = async (params) => {
  const token = Cookies.get("token");

  // Strip undefined/null/empty-string so backend doesn't get blank filters
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const response = await fetch(`${import.meta.env.VITE_API_URL}getitems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      page:     Number(cleanParams.page)  || 1,
      limit:    Number(cleanParams.limit) || 10,
      order:    cleanParams.order         || "asc",
      // filters — only sent when present
      ...(cleanParams.keyword  && { keyword:  cleanParams.keyword  }),
      ...(cleanParams.category && { category: cleanParams.category }),
      ...(cleanParams.type     && { type:     cleanParams.type     }),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch items");
  }

  return response.json();
  // responseFormatter shape:
  // { status, statusCode, message, data: Item[], pagination: { total, page, limit, totalPages } }
};

export function useFetchItems(params) {
  return useQuery({
    queryKey: ["items", params],
    queryFn:  () => fetchItems(params),

    enabled: !!params,

    staleTime: 30 * 1000,

    // v5 replacement for keepPreviousData — keeps last page visible while next loads
    placeholderData: (previousData) => previousData,
  });
}