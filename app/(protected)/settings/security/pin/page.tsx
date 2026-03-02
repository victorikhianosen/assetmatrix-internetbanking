"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { changePin } from "@/app/actions/settings/security/change-pin.action";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ChangePin() {
  const router = useRouter();
  // values
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // show/hide
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // errors
  const [errors, setErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  /* ----------------------------------
     VALIDATION
  ---------------------------------- */
  function validate() {
    const newErrors: typeof errors = {};

    if (!currentPin.trim()) {
      newErrors.current = "Current PIN is required";
    } else if (currentPin.length !== 4) {
      newErrors.current = "PIN must be exactly 4 digits";
    }

    if (!newPin.trim()) {
      newErrors.new = "New PIN is required";
    } else if (newPin.length !== 4) {
      newErrors.new = "PIN must be exactly 4 digits";
    }

    if (!confirmPin.trim()) {
      newErrors.confirm = "Confirm PIN is required";
    } else if (confirmPin.length !== 4) {
      newErrors.confirm = "PIN must be exactly 4 digits";
    } else if (confirmPin !== newPin) {
      newErrors.confirm = "PINs do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  async function handleChangePin(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      current_pin: currentPin,
      new_pin: newPin,
    };

    try {
      setLoading(true);

      const res = await changePin(payload);


      if (res?.responseCode === "000") {
        toast.success(res.message || "Pin updated successfully");

        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
      } else {
        toast.error(res?.message || "Failed to change pin");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-8">
        <button
          onClick={() => router.back()}
          className="flex cursor-pointer items-center gap-2 mb-4 text-sm font-medium text-primary hover:-translate-x-1 transition">
          <ArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Transaction Pin</h1>
          <p className="text-gray-700">Update your transaction pin</p>
        </div>
        <Loader show={loading} />

        <div className="max-w-md mx-auto space-y-7 bg-white rounded-2xl py-5 lg:px-10 px-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold ">Change PIN</h2>
            <p className="text-sm text-gray-700">Enter your current PIN and set a new PIN</p>
          </div>

          {/* Current */}
          <PinInput
            label="Current PIN"
            show={showCurrent}
            toggle={() => setShowCurrent(!showCurrent)}
            value={currentPin}
            onChange={setCurrentPin}
            error={errors.current}
          />

          {/* New */}
          <PinInput
            label="New PIN"
            show={showNew}
            toggle={() => setShowNew(!showNew)}
            value={newPin}
            onChange={setNewPin}
            error={errors.new}
          />

          {/* Confirm */}
          <PinInput
            label="Confirm PIN"
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
            value={confirmPin}
            onChange={setConfirmPin}
            error={errors.confirm}
          />

          <button
            onClick={handleChangePin}
            className="w-full cursor-pointer bg-primary text-white py-3 rounded-xl font-semibold hover:scale-[0.98] transition">
            Update PIN
          </button>
        </div>
      </div>
    </>
  );
}

function PinInput({
  label,
  show,
  toggle,
  value,
  onChange,
  error,
}: {
  label: string;
  show: boolean;
  toggle: () => void;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-2 block">{label}</label>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

        <input
          type={show ? "text" : "password"}
          value={value}
          inputMode="numeric"
          maxLength={4}
          onChange={(e) => {
            // ✅ Allow only digits
            const numericValue = e.target.value.replace(/\D/g, "");

            // ✅ Ensure max 4 digits
            if (numericValue.length <= 4) {
              onChange(numericValue);
            }
          }}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none text-sm transition
            ${
              error
                ? "border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:border-primary focus:ring-primary/20"
            }
          `}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
