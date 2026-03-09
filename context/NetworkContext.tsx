"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast, Id as ToastId } from "react-toastify";
import { processQueue } from "@/lib/requestQueue";

type NetworkContextType = {
  isOnline: boolean;
};

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
});

export const useNetwork = () => useContext(NetworkContext);

export default function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [toastId, setToastId] = useState<ToastId | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      console.log("Offline detected");

      setIsOnline(false);

      if (!toastId) {
        const id = toast.error(
          "No internet connection. Please check your network.",
          {
            autoClose: false,
            closeOnClick: false,
          }
        );

        setToastId(id);
      }
    };

    const handleOnline = () => {
      console.log("Online detected");

      setIsOnline(true);

      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
      }

      toast.success("Connection restored. Syncing pending requests...");
      processQueue();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // IMPORTANT: check status immediately
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [toastId]);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
    </NetworkContext.Provider>
  );
}