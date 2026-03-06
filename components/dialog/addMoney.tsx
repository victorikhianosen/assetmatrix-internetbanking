"use client";

import { UseUser } from "@/context/UserContext";
import { X, Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddMoneyDialog({ open, onClose }: Props) {
  const { user } = UseUser();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, onClose]);

  if (!open) return null;

  const copyAccountNumber = async () => {
    if (!user?.accountno) {
      toast.error("Account number not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(user.accountno);
      toast.success("Account number copied ✓");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const copyAllDetails = async () => {
    if (!user) return;

    const details = `
Bank: Asset Matrix MFB
Account Name: ${user.first_name} ${user.last_name}
Account Number: ${user.accountno}
    `;

    try {
      await navigator.clipboard.writeText(details.trim());
      toast.success("All details copied ✓");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-6 flex-row-reverse">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-secondary/50 hover:text-black">
            <X size={30} />
          </button>

          <h2 className="text-xl font-bold">Add Money</h2>
        </div>

        <div className="space-y-5">
          {/* Bank */}
          <div>
            <p className="text-sm text-secondary/50">Bank</p>
            <p className="font-semibold">Asset Matrix MFB</p>
          </div>

          {/* Account Name */}
          <div>
            <p className="text-sm text-secondary/50">Account Name</p>
            <p className="font-semibold">
              {user?.first_name} {user?.last_name}
            </p>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary/50">Account Number</p>
              <p className="font-semibold ">{user?.accountno}</p>
            </div>

            <button onClick={copyAccountNumber} className="p-2 cursor-pointer rounded-lg hover:bg-gray-100">
              <Copy size={18} />
            </button>
          </div>

          {/* Copy All Button */}
          <button
            onClick={copyAllDetails}
            className="w-full mt-4 bg-primary cursor-pointer text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Copy All Details
          </button>
        </div>
      </div>
    </div>
  );
}
