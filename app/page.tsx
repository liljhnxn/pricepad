"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { CreateRecord } from "@/components/CreateRecord";
import { FindRecord } from "@/components/FindRecord";
import { MyRecords } from "@/components/MyRecords";
import { ShieldCheck, Zap, Globe2 } from "lucide-react";

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-medium mb-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live on Botchain Testnet (Chain ID 968)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transparent On-Chain <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Pricing Records</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Create immutable, verifiable quotes for your products or services. Share simple numeric IDs with clients to verify terms and track acceptance.
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
              <p className="text-[11px] text-zinc-400">Shareable ID for customers</p>
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
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1d1f2b] bg-[#0c0d12] py-6 mt-12 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">PricePad</span>
            <span>&bull;</span>
            <span>Simple pricing. Easy sharing.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              Botchain Explorer
            </a>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              RPC Endpoint
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

