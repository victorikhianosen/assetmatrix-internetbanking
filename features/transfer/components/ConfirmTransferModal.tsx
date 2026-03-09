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

  const { data: balanceData } = UseGetBalance();
  const balance = Number(balanceData?.data?.balance ?? 0);

  /* ---------------- FORMAT ---------------- */

  const formatAmount = (value: string) => {
    if (!value) return "";
    const [intPart, decimalPart] = value.split(".");
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;
  };

  /* ---------------- SAFE PARSE ---------------- */

  const parseAmount = (value: string) => {
    if (!value) return 0;
    const clean = value.replace(/,/g, "");
    return Number(clean);
  };

  /* ---------------- VALIDATE AMOUNT ---------------- */

  const validateAmount = (amount: number) => {
    if (!amount) return "Amount is required";

    if (isNaN(amount)) return "Invalid amount";

    if (amount < MIN_TRANSFER)
      return `Minimum transfer amount is ₦${MIN_TRANSFER}`;

    if (amount > balance) return "Insufficient balance";

    return "";
  };

  /* ---------------- INPUT CHANGE ---------------- */

  const handleChange = (value: string) => {
    const clean = value.replace(/,/g, "");

    // allow numbers + 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(clean)) return;

    setRawAmount(clean);

    const parsed = parseAmount(clean);

    const error = validateAmount(parsed);

    setAmountError(error);
  };

  /* ---------------- NARRATION VALIDATION ---------------- */

  const validateNarration = (text: string) => {
    if (!text.trim()) return "Narration is required";
    if (text.trim().length < 3) return "Narration must be at least 3 characters";
    return "";
  };

  const parsedAmount = parseAmount(rawAmount);

  const isFormValid =
    rawAmount !== "" &&
    !amountError &&
    narration.trim().length >= 3;

  /* ---------------- CONFIRM ---------------- */

  const handleConfirm = () => {
    const narrationErr = validateNarration(narration);
    setNarrationError(narrationErr);

    if (!isFormValid || narrationErr) return;

    onConfirm(parsedAmount, narration.trim());
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        <h3 className="text-lg font-semibold text-primary mb-2">
          Confirm Transfer
        </h3>

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

          {amountError && (
            <p className="text-sm text-red-600 mt-1">{amountError}</p>
          )}

        </div>

        {/* Narration */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Narration <span className="text-red-600">*</span>
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

          {narrationError && (
            <p className="text-sm text-red-600 mt-1">{narrationError}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="w-1/2 border rounded-xl h-12 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className={`w-1/2 rounded-xl h-12 font-semibold transition
            ${
              !isFormValid
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:opacity-90"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}