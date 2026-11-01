"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { botchainTestnet } from "@/lib/chains";
import { shortenAddress } from "@/lib/utils";
import { Wallet, LogOut, AlertTriangle, Layers, Check, Copy } from "lucide-react";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <header className="w-full border-b border-[#232433] bg-[#12131b]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 via-purple-500/10 to-emerald-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-950/40">
            <Layers className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Price<span className="text-purple-400">Pad</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40">
                Botchain 968
              </span>
            </div>
            <p className="text-xs text-zinc-400">Simple pricing. Easy sharing.</p>
          </div>
        </div>

        {/* Wallet & Network Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {isConnected && isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all shadow-sm"
              title="Switch to Botchain Testnet"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch to Botchain</span>
            </button>
          )}

          {isConnected ? (
            <div className="flex items-center gap-1.5 bg-[#1a1b26] border border-[#2d2f42] rounded-xl p-1 pl-3 shadow-inner">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                title="Click to copy address"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{shortenAddress(address)}</span>
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                )}
              </button>
              <button
                onClick={() => disconnect()}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
                title="Disconnect wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-700 via-purple-600 to-emerald-600 text-white hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-purple-950/50 disabled:opacity-60"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

