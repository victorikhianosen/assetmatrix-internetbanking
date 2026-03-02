/**Add commas to numbers */
export function formatNumber(value: number | string): string {
  if (value === null || value === undefined) return "";

  const num = Number(value);
  if (isNaN(num)) return "";

  return num.toLocaleString("en-US");
}

/** Format masked account number */
export function maskNumber(num: string) {
  if (!num) return "*******";
  return "*******" + num.slice(-3);
}

export function formatAmountInput(value: string) {
  // Remove non-digit characters
  const numericValue = value.replace(/\D/g, "");
  // Format with commas
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatCardNumber(cardNumber: string): string {
  if (!cardNumber) return "";
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, "");
  // Get the first three groups of four digits
  const group1 = digits.slice(0, 4);
  const group2 = digits.slice(4, 8);
  const group3 = digits.slice(8, 12);
  // Get the last group of six digits
  const group4 = digits.slice(12, 18);

  // Use non-breaking spaces for visible spacing in HTML
  return [group1, group2, group3, group4]
    .filter(Boolean)
    .join("\u00A0\u00A0");
}
