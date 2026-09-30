import Cookies from "js-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Matches updateItemProvider exactly:
// - PATCH /items/:id  (ownership check runs server-side)
// - Sends FormData when a file is included, JSON otherwise
// - Accepts: title, description, category, type, location, date,
//            keywords (comma string or array), lat, lng, file (image)
// - Server ignores: status, postedBy, verifiedBy

const updateItem = async ({ itemId, payload, file }) => {
  const token = Cookies.get("token");

  let body;
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  if (file) {
    // multipart/form-data — let the browser set Content-Type + boundary
    const formData = new FormData();
    formData.append("file", file);

    // Append all scalar fields
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      // keywords: send as comma-separated string
      if (key === "keywords") {
        const kwString = Array.isArray(value) ? value.join(",") : String(value);
        formData.append("keywords", kwString);
      } else {
        formData.append(key, value);
      }
    });

    body = formData;
  } else {
    // JSON — no file upload
    headers["Content-Type"] = "application/json";

    const jsonPayload = { ...payload };

    // Normalise keywords to comma string for consistency
    if (jsonPayload.keywords && Array.isArray(jsonPayload.keywords)) {
      jsonPayload.keywords = jsonPayload.keywords.join(",");
    }

    body = JSON.stringify(jsonPayload);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}items/${itemId}`,
    {
      method: "PATCH",
      headers,
      body,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update item");
  }

  return response.json(); // { message, data: updatedItem }
};

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateItem,

    // Optimistic update — patch the item in cache immediately
    onMutate: async ({ itemId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });

      const previousItems = queryClient.getQueriesData({ queryKey: ["items"] });

      queryClient.setQueriesData({ queryKey: ["items"] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((item) =>
            item._id === itemId
              ? {
                  ...item,
                  ...payload,
                  // Never allow client to optimistically flip these
                  status: item.status,
                  postedBy: item.postedBy,
                  verifiedBy: item.verifiedBy,
                }
              : item
          ),
        };
      });

      // Also update single-item cache if present
      queryClient.setQueryData(["item", itemId], (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            ...payload,
            status: old.data.status,
            postedBy: old.data.postedBy,
            verifiedBy: old.data.verifiedBy,
          },
        };
      });

      return { previousItems };
    },

    onError: (_err, { itemId }, context) => {
      if (context?.previousItems) {
        context.previousItems.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: (_data, _err, { itemId }) => {
      // Invalidate both the list and the single item
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}