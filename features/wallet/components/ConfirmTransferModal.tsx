"use client";

import { useState } from "react";
import { UseGetBalance } from "@/hooks/useBalance";

type ConfirmTransferModalProps = {
  isOpen: boolean;
  fullName: string;
  accountNumber: string;
  bankName: string;
  onCancel: () => void;
  onConfirm: (amount: number, narration?: string) => void;
};

export default function ConfirmTransferModal({
  isOpen,
  fullName,
  accountNumber,
  bankName,
  onCancel,
  onConfirm,
}: ConfirmTransferModalProps) {
  const MIN_TRANSFER = 10;

  const [rawAmount, setRawAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [narration, setNarration] = useState("");
  const [narrationError, setNarrationError] = useState("");

  /* ---------------- FETCH BALANCE ---------------- */
  const { data: res } = UseGetBalance();
  const balance = Number(res?.data?.balance ?? 0);
  if (!isOpen) return null;

  /* ---------------- FORMAT ---------------- */
  const formatAmount = (value: string) => {
    if (!value) return "";
    const [intPart, decimalPart] = value.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
  };

  const validateNarration = (text: string) => {
    if (!text.trim()) return "Narration is required";
    if (text.trim().length < 3) return "Narration is too short";
    return "";
  };

  /* ---------------- SAFE PARSE ---------------- */
  const parseAmount = (value: string) => {
    if (!value) return NaN;
    const clean = value.replace(/,/g, "");
    return Math.round(Number(clean) * 100) / 100; // avoid float bugs
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = (amount: number) => {
    if (isNaN(amount)) return "Invalid amount";
    if (amount < MIN_TRANSFER) return `Minimum transfer amount is ₦${MIN_TRANSFER}.00`;
    if (amount > balance) return "Insufficient funds";
    return "";
  };

  const handleChange = (input: string) => {
    const clean = input.replace(/,/g, "");

    // allow only valid money input
    if (!/^\d*\.?\d{0,2}$/.test(clean)) return;

    setRawAmount(clean);

    const parsed = parseAmount(clean);
    setAmountError(validate(parsed));
  };

  /* ---------------- BUTTON LOGIC (SINGLE SOURCE) ---------------- */
  const parsedAmount = parseAmount(rawAmount);
  const errorMessage = rawAmount ? validate(parsedAmount) : "";
  const isNarrationValid = narration.trim().length >= 3;
  const isAmountValid = rawAmount !== "" && !errorMessage;
  const isFormValid = isAmountValid && isNarrationValid;

  /* ---------------- CONFIRM ---------------- */
  const handleConfirm = () => {
    const narrationErr = validateNarration(narration);
    setNarrationError(narrationErr);

    if (!isAmountValid || narrationErr) return;

    onConfirm(parsedAmount, narration?.trim() || undefined);

    if (narrationErr) {
      document.querySelector("textarea")?.focus();
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h3 className="text-lg font-semibold text-primary mb-2">Confirm Transfer</h3>

        {/* Recipient */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-4">
          <div>
            <p className="text-xs text-gray-500">Recipient Name</p>
            <p className="font-semibold text-green-600">{fullName}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Account Number</p>
            <p className="font-mono">{accountNumber}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Bank</p>
            <p>{bankName}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-sm font-medium">Amount</label>
          <input
            value={formatAmount(rawAmount)}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border mt-2"
            placeholder="₦0.00"
          />

          {(amountError || errorMessage) && (
            <p className="text-xs text-red-600 mt-1">{amountError || errorMessage}</p>
          )}
        </div>

        {/* Narration */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Narration <span className="text-red-600 text-lg">*</span>
          </label>

          <textarea
            value={narration}
            onChange={(e) => {
              const value = e.target.value;
              setNarration(value);
              setNarrationError(validateNarration(value));
            }}
            placeholder="Add note for this transfer..."
            rows={3}
            className="w-full mt-2 px-4 py-3 rounded-xl border resize-none"
          />
          {narrationError && <p className="text-xs text-red-600 mt-1">{narrationError}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onCancel} className="w-1/2 border rounded-xl h-12">
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className={`w-1/2 rounded-xl h-12 font-semibold transition
              ${
                !isFormValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:opacity-90 cursor-pointer"
              }`}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
