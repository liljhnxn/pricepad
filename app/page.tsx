"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { CreateRecord } from "@/components/CreateRecord";
import { FindRecord } from "@/components/FindRecord";
import { MyRecords } from "@/components/MyRecords";
import { ShieldCheck, Zap, Globe2, ExternalLink, Cpu } from "lucide-react";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecordCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0e13] text-[#e4e4eb]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto pt-2 pb-4">
          <a
            href="https://scan.botchain.ai/address/0x547b29eB85705c4781FcdD935A97aC7024924CE6#code"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 hover:text-emerald-200 hover:border-emerald-700/60 transition-all text-xs font-medium mb-3 shadow-sm group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live on BOT Chain Mainnet (Chain ID 677)</span>
            <ExternalLink className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transparent On-Chain <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Pricing Records</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Create immutable, verifiable quotes for your products or services. Share simple numeric IDs with clients to verify terms and track acceptance on BOT Chain.
          </p>
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

        {/* BOT Chain Ecosystem Showcase Section */}
        <div className="bg-gradient-to-r from-[#141520] via-[#161724] to-[#12131d] border border-[#26283c] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
              <Cpu className="w-6 h-6 text-emerald-400" />
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

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-[#1a1b28] hover:bg-[#222435] border border-[#2e3146] hover:border-emerald-500/40 transition-all shadow-sm"
            >
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>

            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-all shadow-sm"
            >
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1d1f2b] bg-[#0c0d12] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight">PricePad</span>
              <span>&bull;</span>
              <span>Simple pricing. Easy sharing.</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="text-zinc-500">Built on BOT Chain</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
            >
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-zinc-700">&bull;</span>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
            >
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-zinc-700">&bull;</span>
            <a
              href="https://scan.botchain.ai/address/0x547b29eB85705c4781FcdD935A97aC7024924CE6#code"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Contract Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
