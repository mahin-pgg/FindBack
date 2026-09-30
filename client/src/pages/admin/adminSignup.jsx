import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "../../schema/signup.schema.js";
import { useSignup } from "../../hooks/useSignup.hook.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import AdminNavbar from "../../components/navbar/Adminnavbar.jsx";
import AdminSidebar from "../../components/sidebar/adminsidebar.jsx";
import { CheckCircle, AlertCircle } from "lucide-react";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

export default function AdminSignup() {
  const { mutate, isLoading, isError, isSuccess } = useSignup();
  const navigate = useNavigate();

  const [serverError, setServerError]     = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstname: "",
      lastname:  "",
      email:     "",
      password:  "",
      role:      "admin",
    },
  });

  function onSubmit(values) {
    setServerError("");
    setSuccessMessage("");
    mutate(values);
    form.reset();
  }

  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage("Account created successfully! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setServerError("User may already exist or something went wrong.");
    }
  }, [isError]);

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white disabled:opacity-50 transition";

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">
      <AdminNavbar />
      <AdminSidebar />

      <main className="flex-1 min-w-0 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">

            {/* Header strip */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-5 text-center">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                🛡 Create Admin Account
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Add a new admin to manage the platform
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-4">

              {/* Success */}
              {successMessage && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  <CheckCircle size={16} className="shrink-0" />
                  {successMessage}
                </div>
              )}

              {/* Error */}
              {serverError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {serverError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* First + Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      disabled={isLoading}
                      {...form.register("firstname")}
                      className={inputCls}
                    />
                    <FieldError message={form.formState.errors.firstname?.message} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      disabled={isLoading}
                      {...form.register("lastname")}
                      className={inputCls}
                    />
                    <FieldError message={form.formState.errors.lastname?.message} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@campus.com"
                    disabled={isLoading}
                    {...form.register("email")}
                    className={inputCls}
                  />
                  <FieldError message={form.formState.errors.email?.message} />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Min 8 chars, uppercase, number, special"
                    disabled={isLoading}
                    {...form.register("password")}
                    className={inputCls}
                  />
                  <FieldError message={form.formState.errors.password?.message} />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Creating…
                    </span>
                  ) : (
                    "Create Admin Account"
                  )}
                </button>

                {/* Footer link */}
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-500 hover:underline font-medium">
                    Login
                  </Link>
                </p>

              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}