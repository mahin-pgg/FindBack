import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

// Supported params:
//   page, limit, order
//   keyword    — searches firstname, lastname, email
//   role       — "user" | "admin"
//   isBlocked  — true | false

const fetchUsers = async (params = {}) => {
  const token = Cookies.get("token");

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}getusers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        page:  Number(cleanParams.page)  || 1,
        limit: Number(cleanParams.limit) || 10,
        order: cleanParams.order         || "desc",
        ...(cleanParams.keyword                      && { keyword:   cleanParams.keyword   }),
        ...(cleanParams.role                         && { role:      cleanParams.role      }),
        ...(cleanParams.isBlocked !== undefined      && { isBlocked: cleanParams.isBlocked }),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch users");
  }

  return response.json();
  // responseFormatter shape:
  // { status, statusCode, message,
  //   data: User[],
  //   pagination: { total, page, limit, totalPages },
  //   summary: { total, active, blocked, admins } }
};

export function useFetchUsers(params) {
  return useQuery({
    queryKey: ["users", params],
    queryFn:  () => fetchUsers(params),
    enabled:  !!params,
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });
}