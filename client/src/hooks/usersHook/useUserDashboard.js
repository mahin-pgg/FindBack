import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchUserDashboard = async () => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}users/dashboard`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch dashboard");
  }

  return response.json();
  // responseFormatter shape:
  // { status, statusCode, message, data: {
  //     stats:          { lostItems, foundItems, claims, matches },
  //     recentActivity: Item[],
  //     matches:        Match[],
  //     claims:         Claim[],
  //     browseItems:    Item[],
  //     profile:        User,
  //   }
  // }
};

export function useUserDashboard() {
  return useQuery({
    queryKey: ["userDashboard"],
    queryFn:  fetchUserDashboard,
    staleTime: 60 * 1000, // 1 min — dashboard doesn't need aggressive refetching
    placeholderData: (previousData) => previousData,
  });
}