import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";

const fetchItemById = async (itemId) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}items/${itemId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch item");
  }

  return response.json();
  // responseFormatter shape:
  // { data: { item: Item, matches: Match[] } }
};

export function useGetItemById(itemId) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn:  () => fetchItemById(itemId),
    enabled:  !!itemId,
    staleTime: 60 * 1000,
  });
}