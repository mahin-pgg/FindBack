import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const rejectMatchAPI = async (id) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}matches/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Reject failed");
  }

  return res.json();
};

export const useRejectMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectMatchAPI,

    onMutate: async (matchId) => {
  await queryClient.cancelQueries({ queryKey: ["myMatches"] });

  const previousMatches = queryClient.getQueryData(["myMatches"]);

  queryClient.setQueryData(["myMatches"], (old) => {
    if (!old?.data) return old;

    return {
      ...old,
      data: old.data.map((m) =>
        m._id === matchId
          ? { ...m, status: "rejected" }
          : m
      ),
    };
  });

  return { previousMatches };
},

  });
};