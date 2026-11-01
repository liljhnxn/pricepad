import React from "react";
import { RecordStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: RecordStatus | number;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  if (status === RecordStatus.Accepted || status === 1) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-sm ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Accepted
      </span>
    );
  }

  if (status === RecordStatus.Rejected || status === 2) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950/80 text-rose-400 border border-rose-500/30 shadow-sm ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        Rejected
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-950/80 text-purple-300 border border-purple-500/30 shadow-sm ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
      Available
    </span>
  );
}

