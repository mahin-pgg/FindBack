import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schema/login.schema.js";
import { useEffect, useState } from "react";
import { useLogin } from "../../hooks/useLogin.hook.js";
import { useNavigate, Link } from "react-router";
import { toast, Toaster } from "sonner"
import Cookies from "js-cookie";


export default function Login() {
  const { mutate, isLoading, isError, isSuccess } = useLogin();
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    mutate(values);
    form.reset();
  }

  useEffect(() => {
    if (isSuccess) setLogin(true);
  }, [isSuccess]);


  useEffect(() => {
  if (isSuccess) {
    const user = JSON.parse(Cookies.get("user"));

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }
}, [isSuccess]);


  useEffect(() => {
    if (isError) {
      //alert("Login failed. Please check your credentials and try again.");
      toast.error("Login failed. Please check your credentials and try again.");
    }
  }, [isError]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-gray-500 text-sm">
            Login and find your lost items or report found items on campus!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...form.register("email")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...form.register("password")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:underline"
              >
                Signup
              </Link>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </section>
  );
}