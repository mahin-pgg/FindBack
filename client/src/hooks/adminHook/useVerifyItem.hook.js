import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Single hook for both approve and reject.
// Usage:
//   const { mutate: verifyItem } = useVerifyItem();
//   verifyItem({ itemId: "abc", action: "approved" });
//   verifyItem({ itemId: "abc", action: "rejected", reason: "Fake listing" });

const verifyItem = async ({ itemId, action, reason }) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}items/${itemId}/verify`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action,
        ...(reason && { reason }),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to ${action} item`);
  }

  return response.json();
};

export function useVerifyItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyItem,

    // Optimistic update
    onMutate: async ({ itemId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["adminItems"] });
      const previousItems = queryClient.getQueriesData({ queryKey: ["adminItems"] });

      queryClient.setQueriesData({ queryKey: ["adminItems"] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  status:          action,
                  verifiedByAdmin: action === "approved",
                }
              : item
          ),
        };
      });

      return { previousItems };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        context.previousItems.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminItems"] });
    },
  });
}