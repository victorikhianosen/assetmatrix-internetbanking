"use client";

import { useState } from "react";
import PinInput from "@/components/ui/pinInput";


type TransferPinModalProps = {
  isOpen: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (pin: string) => void;
};

export default function BuyDataPinModal({
  isOpen,
  error,
  onCancel,
  onConfirm,
}: TransferPinModalProps) {
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h3 className="text-lg font-semibold text-primary mb-6 pb-14">Confirm Transaction PIN</h3>

        <PinInput value={pin} onChange={setPin} />

        {error && <p className="text-center text-red-600 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 pt-12">
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 h-12 rounded-xl border border-gray-300 text-gray-600">
            Cancel
          </button>

          <button
            type="button"
            disabled={pin.length !== 4}
            onClick={() => onConfirm(pin)}
            className={`w-1/2 h-12 rounded-xl font-semibold
              ${
                pin.length !== 4
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white cursor-pointer"
              }`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
