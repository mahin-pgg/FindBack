import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const acceptMatchAPI = async (id) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}matches/${id}/accept`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Accept failed");
  }

  return res.json();
};

export const useAcceptMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptMatchAPI,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (matchId) => {
      await queryClient.cancelQueries({ queryKey: ["myMatches"] });

      const previousMatches = queryClient.getQueryData(["myMatches"]);

      queryClient.setQueryData(["myMatches"], (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((m) =>
            m._id === matchId
              ? { ...m, status: "accepted" }
              : m
          ),
        };
      });

      return { previousMatches };
    },

    // rollback on error
    onError: (_err, _matchId, context) => {
      queryClient.setQueryData(["myMatches"], context.previousMatches);
    },

    // sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myMatches"] });
    },
  });
};