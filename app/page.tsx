"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { CreateRecord } from "@/components/CreateRecord";
import { FindRecord } from "@/components/FindRecord";
import { MyRecords } from "@/components/MyRecords";
import { getContractAddress } from "@/lib/contract";
import { ShieldCheck, Zap, Globe2, ExternalLink, Check, Copy } from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [copiedContract, setCopiedContract] = useState(false);
  const mainnetContract = getContractAddress();

  const handleRecordCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(mainnetContract);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0e13] text-[#e4e4eb]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto pt-2 pb-4">
          {/* Mainnet Live Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 text-xs font-medium mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Image
              src="/botchain-logo.png"
              alt="BOT Chain Logo"
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain rounded-xs"
            />
            <span>Live on BOT Chain Mainnet (Chain ID 677)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transparent On-Chain <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Pricing Records</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Create immutable, verifiable quotes for your products or services. Share simple numeric IDs with clients to verify terms and track acceptance on BOT Chain.
          </p>

          {/* Official Mainnet Contract Card */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#141520] border border-[#27293d] text-xs shadow-md">
            <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Mainnet Contract:
            </span>
            <span className="font-mono text-emerald-300 font-semibold">{mainnetContract}</span>
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={handleCopyContract}
                className="p-1 rounded-md text-zinc-400 hover:text-white bg-[#1a1b28] hover:bg-[#25273a] transition-colors"
                title="Copy Mainnet contract address"
              >
                {copiedContract ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={`https://scan.botchain.ai/address/${mainnetContract}#code`}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md text-zinc-400 hover:text-emerald-300 bg-[#1a1b28] hover:bg-[#25273a] transition-colors"
                title="View verified contract on BOT Chain Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#13141c] border border-[#232534] shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Instant Unique ID</p>
              <p className="text-[11px] text-zinc-400">Shareable numeric ID for customers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#13141c] border border-[#232534] shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Globe2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Public Lookup</p>
              <p className="text-[11px] text-zinc-400">View records without wallet</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#13141c] border border-[#232534] shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Creator Protected</p>
              <p className="text-[11px] text-zinc-400">Enforced by smart contract</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Create Record & Find Record */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CreateRecord onSuccess={handleRecordCreated} />
          <FindRecord />
        </div>

        {/* My Records Section */}
        <div className="pt-2">
          <MyRecords refreshTrigger={refreshTrigger} />
        </div>

        {/* BOT Chain Ecosystem Showcase Section with Logo In Front of Links */}
        <div className="bg-gradient-to-r from-[#141520] via-[#161724] to-[#12131d] border border-[#26283c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50 overflow-hidden p-1.5">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Powered by BOT Chain</h3>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  Mainnet 677
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-md">
                Fast, secure, and low-cost decentralized infrastructure designed for high-performance Web3 applications.
              </p>
            </div>
          </div>

          {/* Links with BOT Chain Logo at the front */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-[#1a1b28] hover:bg-[#222435] border border-[#2e3146] hover:border-emerald-500/40 transition-all shadow-sm group"
            >
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={18}
                height={18}
                className="w-4 h-4 object-contain rounded-xs shrink-0"
              />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            </a>

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400/60 transition-all shadow-sm group"
            >
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={18}
                height={18}
                className="w-4 h-4 object-contain rounded-xs shrink-0"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer with Logo at the front of links */}
      <footer className="w-full border-t border-[#1d1f2b] bg-[#0c0d12] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">PricePad</span>
              <span>&bull;</span>
              <span>Simple pricing. Easy sharing.</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-xs"
              />
              <span>Built on BOT Chain</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-xs"
              />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <span className="text-zinc-700">&bull;</span>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Image
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain rounded-xs"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <span className="text-zinc-700">&bull;</span>
            <a
              href={`https://scan.botchain.ai/address/${mainnetContract}#code`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-300 transition-colors flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mainnet Contract</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
