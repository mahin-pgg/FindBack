import React from "react";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { itemSchema } from "../../schema/item.schema.js";
import { useCreateItem } from "../../hooks/itemsHook/useCreateItem.hook.js";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

const ReportLost = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "", description: "", category: "",
      location: "", date: "", keywords: "",
      lat: "", lng: "", type: "lost",
    },
  });

  const { mutateAsync: createItem } = useCreateItem({
    onSuccess: () => {
      toast("Item reported successfully", {
        description: "Your report has been submitted.",
      });
      reset();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? "Failed to submit report");
    },
  });

  async function onSubmit(data) {
    const formData = new FormData();
    formData.append("title",       data.title);
    formData.append("type",        data.type);
    formData.append("category",    data.category);
    formData.append("location",    data.location);
    formData.append("date",        data.date);
    formData.append("description", data.description);
    if (data.keywords)  formData.append("keywords", data.keywords);
    if (data.lat)       formData.append("lat",      data.lat);
    if (data.lng)       formData.append("lng",      data.lng);
    if (data.image?.[0]) formData.append("image",   data.image[0]);
    await createItem(formData);
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white disabled:opacity-50 transition";

  const labelCls = "block text-gray-600 text-sm font-medium mb-1";

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 md:p-6 flex items-start md:items-center justify-center mt-16 lg:mt-0">
        <div className="w-full max-w-2xl lg:mt-10">

          {/* ── Card ── */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-linear-to-r from-indigo-500 to-purple-500 px-6 py-5">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Report Lost / Found Item
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Fill in the details below to submit your report
              </p>
            </div>

            <form
              className="p-5 md:p-7 space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >

              {/* ── Title + Type ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Black Wallet"
                    className={inputCls}
                    disabled={isSubmitting}
                    {...register("title")}
                  />
                  <FieldError message={errors.title?.message} />
                </div>

                <div>
                  <label className={labelCls}>Report Type</label>
                  <select
                    className={inputCls}
                    disabled={isSubmitting}
                    {...register("type")}
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                  <FieldError message={errors.type?.message} />
                </div>
              </div>

              {/* ── Category + Location ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <select
                    className={inputCls}
                    disabled={isSubmitting}
                    {...register("category")}
                  >
                    <option value="">Select Category</option>
                    <option value="wallet">Wallet</option>
                    <option value="phone">Phone</option>
                    <option value="bag">Bag</option>
                    <option value="id">ID Card</option>
                    <option value="electronics">Electronics</option>
                    <option value="others">Others</option>
                  </select>
                  <FieldError message={errors.category?.message} />
                </div>

                <div>
                  <label className={labelCls}>Last Seen Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Library, Hostel"
                    className={inputCls}
                    disabled={isSubmitting}
                    {...register("location")}
                  />
                  <FieldError message={errors.location?.message} />
                </div>
              </div>

              {/* ── Date + Keywords ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date Lost / Found</label>
                  <input
                    type="date"
                    className={inputCls}
                    disabled={isSubmitting}
                    {...register("date")}
                  />
                  <FieldError message={errors.date?.message} />
                </div>

                <div>
                  <label className={labelCls}>Keywords</label>
                  <input
                    type="text"
                    placeholder="e.g. black, leather, id"
                    className={inputCls}
                    disabled={isSubmitting}
                    {...register("keywords")}
                  />
                  <FieldError message={errors.keywords?.message} />
                </div>
              </div>

              {/* ── Description ── */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  rows="3"
                  placeholder="Color, brand, distinguishing features..."
                  className={inputCls}
                  disabled={isSubmitting}
                  {...register("description")}
                />
                <FieldError message={errors.description?.message} />
              </div>

              {/* ── Coordinates ── */}
              <div>
                <label className={labelCls}>
                  Coordinates{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      className={inputCls}
                      disabled={isSubmitting}
                      {...register("lat")}
                    />
                    <FieldError message={errors.lat?.message} />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      className={inputCls}
                      disabled={isSubmitting}
                      {...register("lng")}
                    />
                    <FieldError message={errors.lng?.message} />
                  </div>
                </div>
              </div>

              {/* ── Image ── */}
              <div>
                <label className={labelCls}>
                  Upload Image{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-white hover:border-indigo-300 transition">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 disabled:opacity-50"
                    disabled={isSubmitting}
                    {...register("image")}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG or WEBP · Max 5MB
                  </p>
                </div>
                <FieldError message={errors.image?.message} />
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  "Submit Report"
                )}
              </button>

            </form>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default ReportLost;