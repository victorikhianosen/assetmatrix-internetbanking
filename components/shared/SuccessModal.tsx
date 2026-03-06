"use client";

type Props = {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
};

export default function SuccessModal({
  isOpen,
  message = "Your transfer was completed successfully.", 
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-10 text-center shadow-xl animate-pop">

        {/* ===== Icon + Sparkles wrapper ===== */}
        <div className="relative mx-auto mb-8 w-24 h-24 flex items-center justify-center">

          {/* sparkles */}
          <span className="absolute -top-2 left-2 text-yellow-400 animate-ping">✨</span>
          <span className="absolute top-0 right-0 text-yellow-300 animate-bounce">⭐</span>
          <span className="absolute -bottom-1 left-0 text-yellow-400 animate-pulse">✨</span>
          <span className="absolute bottom-0 right-2 text-yellow-300 animate-ping">⭐</span>
          <span className="absolute top-1/2 -left-3 text-yellow-300 animate-bounce">✨</span>
          <span className="absolute top-1/2 -right-3 text-yellow-400 animate-pulse">⭐</span>

          {/* success circle */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-md relative">

            {/* glow ripple */}
            <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30"></div>

            {/* svg check */}
            <svg
              className="w-10 h-10 text-green-600 relative"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-primary mb-2">
          Transaction Successful
        </h3>

        {/* ✅ dynamic message */}
        <p className="text-sm text-gray-500 mb-8">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full h-12 cursor-pointer rounded-xl bg-primary text-white font-semibold hover:opacity-90"
        >
          Done
        </button>
      </div>

      <style jsx>{`
        .animate-pop {
          animation: pop 0.25s ease;
        }
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
