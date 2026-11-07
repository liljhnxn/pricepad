import { formatEther } from "viem";

export function shortenAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPrice(weiAmount?: bigint): string {
  if (weiAmount === undefined) return "0.00";
  try {
    const formatted = formatEther(weiAmount);
    // Trim trailing zeros after decimal if sensible, but keep 2 or more decimals if needed
    const parts = formatted.split(".");
    if (parts.length === 1) return `${parts[0]} BOT`;
    const decimals = parts[1].slice(0, 4);
    return `${parts[0]}.${decimals} BOT`;
  } catch {
    return `${weiAmount.toString()} BOT`;
  }
}

export function formatDate(timestamp?: bigint | number): string {
  if (!timestamp) return "N/A";
  const num = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (num === 0) return "N/A";
  const date = new Date(num * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function parseContractError(error: unknown): string {
  if (!error) return "An unexpected error occurred.";
  const errStr = (error as Error).message || String(error);

  if (errStr.includes("EmptyName")) return "Product or service name cannot be empty.";
  if (errStr.includes("InvalidPrice")) return "Price must be greater than zero.";
  if (errStr.includes("RecordNotFound")) return "The requested record was not found.";
  if (errStr.includes("NotCreator")) return "Only the creator of this record can perform this action.";
  if (errStr.includes("InvalidStatusChange")) return "Invalid status change. Only Available records can be set to Accepted or Rejected.";
  if (errStr.includes("User rejected") || errStr.includes("User denied")) return "Transaction rejected by user.";

  // Return a readable snippet or fallback
  if (errStr.length > 120) {
    return errStr.slice(0, 117) + "...";
  }
  return errStr;
}
