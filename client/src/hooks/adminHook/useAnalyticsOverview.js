import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchAnalyticsOverview = async () => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}analytics-overview`,
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
      errorData.message || "Failed to fetch analytics overview"
    );
  }

  return response.json();
};

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ["analyticsOverview"],
    queryFn: fetchAnalyticsOverview,

    staleTime: 60 * 1000,

    retry: 1,

    enabled: !!Cookies.get("token"),
  });
}