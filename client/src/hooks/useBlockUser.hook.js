import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

const blockUser = async (userId) => {
  const token = Cookies.get("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}users/${userId}/block`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user status");
  }

  return res.json();
};

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUser,

    // Optimistic update — flip isBlocked instantly in cache
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueriesData({ queryKey: ["users"] });

      queryClient.setQueriesData({ queryKey: ["users"] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((user) =>
            user._id === userId
              ? { ...user, isBlocked: !user.isBlocked }
              : user
          ),
        };
      });

      return { previousUsers };
    },

    onError: (_err, _userId, context) => {
      // Rollback on failure
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}