"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PRICEPAD_ABI, getContractAddress } from "@/lib/contract";
import { StatusBadge } from "./StatusBadge";
import { formatPrice, formatDate, parseContractError } from "@/lib/utils";
import { PriceRecord, RecordStatus } from "@/lib/types";
import {
  FolderKanban,
  RotateCw,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";

export function MyRecords({ refreshTrigger }: { refreshTrigger?: number }) {
  const { address, isConnected } = useAccount();
  const contractAddress = getContractAddress();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingRecordId, setUpdatingRecordId] = useState<bigint | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Read caller's records
  const {
    data: myRecordsData,
    isLoading: isLoadingRecords,
    error: readError,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: PRICEPAD_ABI,
    functionName: "getMyRecords",
    account: address,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Re-fetch when trigger changes
  useEffect(() => {
    if (isConnected) {
      refetch();
    }
  }, [refreshTrigger, isConnected, refetch]);

  // Status update mutation
  const {
    data: updateTxHash,
    error: updateError,
    isPending: isUpdatingTx,
    writeContract,
    reset: resetUpdate,
  } = useWriteContract();

  const { isLoading: isWaitingReceipt, isSuccess: isUpdateSuccess } =
    useWaitForTransactionReceipt({
      hash: updateTxHash,
    });

  useEffect(() => {
    if (isUpdateSuccess) {
      setUpdatingRecordId(null);
      resetUpdate();
      refetch();
    }
  }, [isUpdateSuccess, refetch, resetUpdate]);

  const handleUpdateStatus = (id: bigint, newStatus: RecordStatus) => {
    setActionError(null);
    setUpdatingRecordId(id);

    try {
      writeContract({
        address: contractAddress,
        abi: PRICEPAD_ABI,
        functionName: "updateStatus",
        args: [id, newStatus],
      });
    } catch (err: unknown) {
      setActionError(parseContractError(err));
      setUpdatingRecordId(null);
    }
  };

  const handleCopy = (idStr: string) => {
    navigator.clipboard.writeText(idStr);
    setCopiedId(idStr);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isConnected) {
    return (
      <div className="bg-[#151620] border border-[#262838] rounded-2xl p-6 shadow-xl text-center py-12">
        <FolderKanban className="w-10 h-10 text-purple-400/50 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">My Records</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
          Connect your wallet above to see and manage all the price records you have created.
        </p>
      </div>
    );
  }

  const records = (myRecordsData as PriceRecord[]) || [];
  const totalCount = records.length;

  return (
    <div className="bg-[#151620] border border-[#262838] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#232433]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <FolderKanban className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white tracking-tight">My Records</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
                {totalCount} Total
              </span>
            </div>
            <p className="text-xs text-zinc-400">Manage and update statuses for records created by your wallet</p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoadingRecords}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-[#101117] border border-[#2d2f42] hover:border-purple-500/40 transition-all disabled:opacity-50"
          title="Refresh records list"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoadingRecords ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {actionError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {updateError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{parseContractError(updateError)}</span>
        </div>
      )}

      {readError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Error loading records: {parseContractError(readError)}</span>
        </div>
      )}

      {isLoadingRecords ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <p className="text-xs">Fetching your price records from Botchain...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-[#27293a] rounded-xl bg-[#111218]">
          <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-300">No records found</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            You haven&apos;t created any price records with this wallet yet. Use the creation form above to create your first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {records.map((rec) => {
            const idStr = rec.id.toString();
            const isUpdatingThis =
              (isUpdatingTx || isWaitingReceipt) && updatingRecordId === rec.id;
            const isAvailable = Number(rec.status) === RecordStatus.Available;

            return (
              <div
                key={idStr}
                className="bg-[#12131b] border border-[#252737] hover:border-[#383b54] rounded-xl p-4 transition-all duration-200 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleCopy(idStr)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[#1a1b26] text-purple-300 border border-purple-900/40 hover:border-purple-600/50 transition-colors"
                      title="Click to copy Record ID"
                    >
                      <span>#{idStr}</span>
                      {copiedId === idStr ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-500" />
                      )}
                    </button>
                    <StatusBadge status={rec.status} />
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(rec.createdAt)}
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-white tracking-tight truncate">
                    {rec.name}
                  </h4>

                  {rec.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {rec.description}
                    </p>
                  )}
                </div>

                {/* Right controls: Price and Status Actions */}
                <div className="flex flex-row sm:flex-row items-center justify-between lg:justify-end gap-4 shrink-0 pt-2 lg:pt-0 border-t border-[#1e202d] lg:border-t-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                      Price
                    </span>
                    <span className="text-base font-bold text-emerald-400">
                      {formatPrice(rec.price)}
                    </span>
                  </div>

                  {/* Actions: Update Status */}
                  <div className="flex items-center gap-2">
                    {isAvailable ? (
                      <>
                        <button
                          type="button"
                          disabled={isUpdatingThis || isUpdatingTx || isWaitingReceipt}
                          onClick={() => handleUpdateStatus(rec.id, RecordStatus.Accepted)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-colors disabled:opacity-50 shadow-sm"
                          title="Mark offer as Accepted"
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Accept</span>
                        </button>

                        <button
                          type="button"
                          disabled={isUpdatingThis || isUpdatingTx || isWaitingReceipt}
                          onClick={() => handleUpdateStatus(rec.id, RecordStatus.Rejected)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 transition-colors disabled:opacity-50 shadow-sm"
                          title="Mark offer as Rejected"
                        >
                          {isUpdatingThis ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-medium text-zinc-500 italic bg-[#171822] px-2.5 py-1 rounded-md border border-[#262836]">
                        Status finalized
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

