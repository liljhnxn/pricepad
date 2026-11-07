"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, decodeEventLog } from "viem";
import { PRICEPAD_ABI, getContractAddress } from "@/lib/contract";
import { parseContractError } from "@/lib/utils";
import { PlusCircle, Loader2, CheckCircle2, Copy, ExternalLink, AlertCircle, Sparkles } from "lucide-react";

interface CreateRecordProps {
  onSuccess?: () => void;
}

export function CreateRecord({ onSuccess }: CreateRecordProps) {
  const { isConnected } = useAccount();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [createdRecordId, setCreatedRecordId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const contractAddress = getContractAddress();

  const {
    data: txHash,
    error: writeError,
    isPending: isSubmitting,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Extract created record ID from transaction receipt logs
  useEffect(() => {
    if (isConfirmed && receipt) {
      let foundId: string | null = null;
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: PRICEPAD_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "RecordCreated" && decoded.args) {
            const idArg = (decoded.args as { id?: bigint }).id;
            if (idArg !== undefined) {
              foundId = idArg.toString();
              break;
            }
          }
        } catch {
          // not our event or unparseable, continue
        }
      }

      if (foundId) {
        setCreatedRecordId(foundId);
      }
      onSuccess?.();
    }
  }, [isConfirmed, receipt, onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setCreatedRecordId(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError("Please enter a product or service name.");
      return;
    }

    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setValidationError("Please enter a valid price greater than 0.");
      return;
    }

    try {
      const priceInWei = parseEther(price);
      writeContract({
        address: contractAddress,
        abi: PRICEPAD_ABI,
        functionName: "createRecord",
        args: [trimmedName, description.trim(), priceInWei],
      });
    } catch (err: unknown) {
      setValidationError(parseContractError(err));
    }
  };

  const handleCopyId = () => {
    if (createdRecordId) {
      navigator.clipboard.writeText(createdRecordId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCreatedRecordId(null);
    resetWrite();
  };

  return (
    <div className="bg-[#151620] border border-[#262838] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <PlusCircle className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">Create Price Record</h2>
          <p className="text-xs text-zinc-400">Define a pricing quote and share the unique ID with your client</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-10 px-4 border border-dashed border-[#2a2c3d] rounded-xl bg-[#111218]">
          <Sparkles className="w-8 h-8 text-purple-400/60 mx-auto mb-2" />
          <p className="text-sm text-zinc-300 font-medium">Wallet Not Connected</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Connect your MetaMask or Web3 wallet to generate and manage price records on Botchain Mainnet.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Product or Service Name <span className="text-purple-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Full-Stack Web Development, Logo Design"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101117] border border-[#2d2f42] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Short Description <span className="text-zinc-500">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Scope of work, deliverables, timeline, or package details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101117] border border-[#2d2f42] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Price (BOT) <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.000000000000000001"
                required
                placeholder="10.0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-[#101117] border border-[#2d2f42] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-400 pointer-events-none">
                BOT
              </span>
            </div>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {writeError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{parseContractError(writeError)}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isConfirming}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-700 via-purple-600 to-emerald-600 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-purple-950/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{isSubmitting ? "Confirm in Wallet..." : "Creating on Botchain..."}</span>
              </>
            ) : (
              <span>Create Record</span>
            )}
          </button>
        </form>
      )}

      {/* Success banner with generated ID, copy button & transaction link */}
      {isConfirmed && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <h3 className="text-sm font-semibold">Record Created Successfully!</h3>
          </div>

          {createdRecordId && (
            <div className="bg-[#0f1015] border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Unique Record ID
                </span>
                <span className="text-xl font-bold text-white tracking-wide">#{createdRecordId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors border border-emerald-500/30"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          )}

          {txHash && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-zinc-400">Transaction receipt:</span>
              <a
                href={`https://scan.botchain.ai/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
              >
                <span>View on Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleResetForm}
              className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 transition-colors"
            >
              Create another record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
