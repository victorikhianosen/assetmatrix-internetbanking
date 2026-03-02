import { useRef } from "react";


export default function PinInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (pin: string) => void;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (val: string, index: number) => {
    if (!/^\d?$/.test(val)) return;

    const pinArr = value.split("");
    pinArr[index] = val;

    const newPin = pinArr.join("").padEnd(4, "");
    onChange(newPin);

    if (val && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const pinArr = value.split("");
    pinArr[index] = "";
    onChange(pinArr.join(""));

    if (index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-center mb-4">
        Enter Transaction PIN
      </label>

      <div className="flex justify-center gap-4">
        {[0, 1, 2, 3].map((i) => (
       <input
  key={i}
  ref={(el) => {
    inputsRef.current[i] = el;
  }}
  type="password"
  inputMode="numeric"
  maxLength={1}
  value={value[i] || ""}
  onChange={(e) => handleChange(e.target.value, i)}
  onKeyDown={(e) =>
    e.key === "Backspace" && handleBackspace(i)
  }
  className="w-14 h-14 text-center text-xl font-semibold rounded-xl border"
/>

        ))}
      </div>
    </div>
  );
}
