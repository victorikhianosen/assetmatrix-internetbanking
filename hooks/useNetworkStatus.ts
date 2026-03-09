"use client";
import { useEffect, useRef } from "react";
import { toast,Id as ToastId } from "react-toastify";

export function useNetworkStatus() {
  const offlineToastId = useRef<ToastId | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      // Show a persistent toast only if one isn't already shown
      if (!offlineToastId.current) {
        offlineToastId.current = toast.error("No internet connection. Please check your network.", {
          autoClose: false, // persistent until connection returns
          closeOnClick: false,
          draggable: false,
        });
      }
    };

    const handleOnline = () => {
      // Dismiss offline toast if it exists
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
        offlineToastId.current = null;
      }
      toast.success("Back online!", { autoClose: 3000 });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Initial check
    if (!navigator.onLine) handleOffline();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}
