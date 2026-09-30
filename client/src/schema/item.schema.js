import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const itemSchema = z
  .object({
    title: z.string().min(2).max(100),

    type: z.enum(["lost", "found"], {
      required_error: "Please select a report type",
    }),

    category: z.enum(
      ["wallet", "phone", "bag", "id", "electronics", "others"],
      {
        required_error: "Please select a category",
      }
    ),

    location: z.string().min(2).max(200),


  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selected <= today;
    }, "Date cannot be in the future"),

    description: z.string().min(10).max(1000),

    keywords: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          return val
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0);
        }
        return val;
      },
      z.array(z.string().min(1)).optional()
    ),

    lat: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(-90).max(90).optional()
    ),

    lng: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(-180).max(180).optional()
    ),

  image: z
    .any()
    .optional()
    .refine(
      (files) => !files?.[0] || files[0].size <= MAX_FILE_SIZE,
      "Image must be under 5MB"
    )
    .refine(
      (files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      "Only .jpg, .jpeg, .png, and .webp images are accepted"
    ),
  }).refine(
    (data) => {
      const hasLat = data.lat && data.lat.trim() !== "";
      const hasLng = data.lng && data.lng.trim() !== "";
      return (hasLat && hasLng) || (!hasLat && !hasLng);
    },
    {
      message: "Both latitude and longitude must be provided together",
      path: ["lat"],
    }
  );