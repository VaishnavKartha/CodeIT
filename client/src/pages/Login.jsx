import React, { useState } from "react";
import useAuth from "../Hooks/useAuth";
import {Eye,EyeClosed} from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword,setShowPassword] = useState(false);

  const {login} = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    await login(formData);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5174/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome back
            </h1>

            <p className="text-zinc-400 mt-2 text-sm">
              Login to your account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-300 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="
                  w-full
                  px-4 py-3
                  bg-zinc-950
                  border border-zinc-700
                  rounded-lg
                  text-white
                  placeholder-zinc-500
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                "
              />
            </div>

        
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-300"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </button>
              </div>

            <div className="relative">

              <input
                id="password"
                type={showPassword ? "text":"password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="
                  w-full
                  px-4 py-3
                  bg-zinc-950
                  border border-zinc-700
                  rounded-lg
                  text-white
                  placeholder-zinc-500
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/20
                "
              />

              <button onClick={()=>setShowPassword(!showPassword)} 
                type="button"
                className="cursor-pointer absolute top-[50%] transform translate-y-[-50%] right-2">
                    {!showPassword?<Eye/>:<EyeClosed/>}
                </button>
            </div>
            </div>

           
            <button
              type="submit"
              className="
                w-full
                py-3
                rounded-lg
                bg-indigo-600
                hover:bg-indigo-500
                active:bg-indigo-700
                text-white
                font-semibold
                transition
                duration-200
                shadow-lg
                shadow-indigo-600/20
                mt-2
              "
            >
              Login
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-zinc-800 flex-1"></div>

            <span className="text-xs text-zinc-500 uppercase">
              or
            </span>

            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
              w-full
              py-3
              rounded-lg
              bg-white
              hover:bg-zinc-100
              text-zinc-900
              font-semibold
              transition
              duration-200
              flex
              items-center
              justify-center
              gap-3
            "
          >
            {/* Google Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.32h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.43z"
              />
              <path
                fill="#34A853"
                d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6z"
              />
              <path
                fill="#FBBC05"
                d="M6.54 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.15.31-1.68V7.79H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.21l3.24-2.53z"
              />
              <path
                fill="#EA4335"
                d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.36 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.01 9.46 6.29 12 6.29z"
              />
            </svg>

            Continue with Google
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-zinc-400 mt-7">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Sign up
            </a>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;