"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SideBar from "../../../features/auth/components/SideBar";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import { login } from "@/features/auth/services/auth.service";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");

  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  /* ---------------------------------------------------
       1. DEVICE INFO & INITIAL LOCATION TRIGGER
    --------------------------------------------------- */
  useEffect(() => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("device_id", id);
    }
    setDeviceId(id);

    handleLocationRequest();
  }, []);

  /* ---------------------------------------------------
       2. GEOLOCATION LOGIC
    --------------------------------------------------- */
  const handleLocationRequest = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    const options = {
      enableHighAccuracy: true, // Forces the device to use GPS if available
      timeout: 10000, // Increased timeout for better precision
      maximumAge: 0, // Do not use cached location
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLon(String(pos.coords.longitude));
        setLocationAllowed(true);
        setLocationError(false);
      },
      (err) => {
        setLocationAllowed(false);
        setLocationError(true);
        if (err.code === 1) {
          toast.warn("Please allow location access to log in.");
        }
      },
      options,
    );
  }, []);

  // Keep location fresh every 10 seconds if already allowed
  useEffect(() => {
    if (!locationAllowed) return;

    const interval = setInterval(handleLocationRequest, 10000);
    return () => clearInterval(interval);
  }, [locationAllowed, handleLocationRequest]);

  /* ---------------------------------------------------
       3. SUBMIT
    --------------------------------------------------- */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username || !password) {
      setErrors({
        username: username ? "" : "Username is required",
        password: password ? "" : "Password is required",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username,
        password,
        lat,
        lon,
        device_model: typeof window !== "undefined" ? navigator.userAgent : "web",
        device_id: "web",
        device_token: deviceId,
      };

      const res = await login(payload);
      if (res?.responseCode === "000") {

        toast.success("Login successful");
        setTimeout(() => router.push("/dashboard"), 2000);
        return;
      }

      toast.error(res?.message || "Request failed");
      setApiError(res?.message || "Invalid credentials");
    } catch {
      toast.error("internal server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Loader show={loading} />

      <div className="min-h-screen flex bg-[#F7F7F7]">
        <SideBar />

        <div className="w-full md:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                className="h-12 object-contain"
                width={100}
                height={100}
              />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary">Login to your account</h2>
              <p className="text-sm text-gray-500">Enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* USERNAME */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Username</label>
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((p) => ({ ...p, username: "" }));
                  }}
                  className={`w-full text-black rounded-lg border px-4 py-3 focus:ring-2 focus:ring-[#fee028] ${errors.username && "border-red-500"}`}
                />
                {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-black focus:ring-2 focus:ring-[#fee028] ${errors.password && "border-red-500"}`}
                />
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
              </div>

              {apiError && <p className="text-sm text-red-600 text-center">{apiError}</p>}

              {/* CONDITIONAL LOGIN BUTTON */}
              {locationAllowed ? (
                <button
                  type="submit"
                  className="w-full text-md py-3 rounded-lg font-semibold bg-primary text-white hover:opacity-90 transition-all cursor-pointer">
                  Login
                </button>
              ) : (
                <div className="text-center space-y-3">
                  <p className="text-sm text-red-600 font-medium">
                    Location access is strictly required to access the login page.
                  </p>
                  <button
                    type="button"
                    onClick={handleLocationRequest}
                    className="text-md bg-primary px-6 py-3 text-white rounded-full cursor-pointer hover:opacity-90">
                    Click here to grant Location Permission
                  </button>
                </div>
              )}
            </form>

            <div className="flex justify-between items-center mt-4">
              <Link href="/phone-setup" className="text-sm text-primary hover:underline">
                Create account
              </Link>
              <Link href="/forget-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
