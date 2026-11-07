"use client";

import React, { useState } from "react";
import { createPublicClient, http } from "viem";
import { botchainMainnet } from "@/lib/chains";
import { PRICEPAD_ABI, getContractAddress } from "@/lib/contract";
import { StatusBadge } from "./StatusBadge";
import { shortenAddress, formatPrice, formatDate, parseContractError } from "@/lib/utils";
import { Search, Loader2, AlertCircle, Calendar, User, Tag, Check, Copy } from "lucide-react";

interface RecordData {
  id: bigint;
  creator: `0x${string}`;
  name: string;
  description: string;
  price: bigint;
  status: number;
  createdAt: bigint;
}

export function FindRecord() {
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<RecordData | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCreator, setCopiedCreator] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchId.trim().replace(/^#/, "");

    if (!trimmed || isNaN(Number(trimmed)) || Number(trimmed) <= 0) {
      setError("Please enter a valid numeric Record ID.");
      setRecord(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecord(null);

    try {
      const publicClient = createPublicClient({
        chain: botchainMainnet,
        transport: http("https://rpc.botchain.ai"),
      });

      const contractAddress = getContractAddress();
      const idBigInt = BigInt(trimmed);

      const result = (await publicClient.readContract({
        address: contractAddress,
        abi: PRICEPAD_ABI,
        functionName: "getRecord",
        args: [idBigInt],
      })) as RecordData;

      setRecord(result);
    } catch (err: unknown) {
      setError(parseContractError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyId = () => {
    if (record) {
      navigator.clipboard.writeText(record.id.toString());
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyCreator = () => {
    if (record) {
      navigator.clipboard.writeText(record.creator);
      setCopiedCreator(true);
      setTimeout(() => setCopiedCreator(false), 2000);
    }
  };

  return (
    <div className="bg-[#151620] border border-[#262838] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Search className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Find a Record</h2>
          <p className="text-xs text-zinc-400">View verified pricing quotes directly on-chain without needing a wallet</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Record ID (e.g. 1, 2, 42)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#101117] border border-[#2d2f42] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !searchId.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 active:scale-98 transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>View Record</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {record && (
        <div className="mt-6 border border-[#2e3146] bg-[#111219] rounded-xl p-5 space-y-4 animate-fade-in shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#232534]">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-zinc-400">Record #{record.id.toString()}</span>
              <button
                onClick={handleCopyId}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Copy Record ID"
              >
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <StatusBadge status={record.status} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{record.name}</h3>
            {record.description ? (
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed whitespace-pre-wrap bg-[#151722] p-3 rounded-lg border border-[#262838]">
                {record.description}
              </p>
            ) : (
              <p className="text-xs italic text-zinc-500 mt-1">No description provided</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Price */}
            <div className="bg-[#161824] border border-[#27293a] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                <span>Price</span>
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {formatPrice(record.price)}
              </div>
            </div>

            {/* Creator */}
            <div className="bg-[#161824] border border-[#27293a] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Creator</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-zinc-200">
                <span>{shortenAddress(record.creator)}</span>
                <button
                  onClick={handleCopyCreator}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1"
                  title="Copy full creator address"
                >
                  {copiedCreator ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Date */}
            <div className="bg-[#161824] border border-[#27293a] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Created On</span>
              </div>
              <div className="text-xs font-medium text-zinc-300">
                {formatDate(record.createdAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
