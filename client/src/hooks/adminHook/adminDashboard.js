import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchAdminDashboard = async () => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}dashboard`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "Failed to fetch admin dashboard"
    );
  }

  return response.json();

  // Expected response:
  // {
  //   stats,
  //   users,
  //   claims,
  //   analytics,
  //   logs
  // }
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: fetchAdminDashboard,

    // Dashboard doesn't need constant refetch
    staleTime: 60 * 1000, // 1 min

    // Retry once only (avoid spam on auth errors)
    retry: 1,

    // Optional: disable if no token
    enabled: !!Cookies.get("token"),
  });
}