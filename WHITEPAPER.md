# PricePad — Whitepaper & Pitch Deck

> **Decentralized Pricing & Verifiable Quote Infrastructure for the Gig Economy**  
> *Simple pricing. Easy sharing.*

---

## 1. Executive Summary

**PricePad** is a decentralized, lightweight Web3 pricing application designed for freelancers, independent contractors, and small business owners. It bridges the gap between decentralized transparency and real-world client usability by allowing service providers to create permanent, tamper-proof price records on the blockchain and share simple numeric IDs with clients.

Customers can review, inspect, and verify the agreed-upon scope and pricing directly on-chain without needing a cryptocurrency wallet or Web3 expertise. Meanwhile, service providers retain sovereign, smart-contract-enforced control over the lifecycle of their quotes (Available, Accepted, Rejected).

* **Live Deployment**: Botchain Mainnet (Chain ID `677`)
* **Contract Address**: `0x547b29eB85705c4781FcdD935A97aC7024924CE6`
* **Explorer Verification**: [scan.botchain.ai/address/0x547b29eB85705c4781FcdD935A97aC7024924CE6#code](https://scan.botchain.ai/address/0x547b29eB85705c4781FcdD935A97aC7024924CE6#code)
* **GitHub Repository**: [github.com/liljhnxn/pricepad](https://github.com/liljhnxn/pricepad)

---

## 2. Problem Statement

Freelancers and small businesses face recurring friction in pricing, scope agreements, and dispute resolution:

1. **Scope Creep & Ambiguity**: Quotations shared via messaging apps or informal emails often lead to disputes over what was originally quoted and accepted.
2. **Centralized Dependency & Alteration**: PDF quotes and invoices can easily be forged, miscommunicated, or modified without mutual consent.
3. **Web3 Client Barrier**: Most Web3 contracting tools require both parties to install a browser wallet, manage gas tokens, and navigate complex interfaces. Non-crypto-native clients reject this friction immediately.
4. **Bloated Invoicing Platforms**: Existing SaaS invoice tools charge heavy subscription fees and lock user data within proprietary silos.

---

## 3. The PricePad Solution

PricePad provides an elegant, minimalist balance:

* **Single-Transaction Creation**: Service providers connect their wallet, define deliverables, set a price, and mint a permanent on-chain quote record.
* **Frictionless Numeric ID**: Instead of cumbersome 66-character hashes, quotes receive human-readable IDs (`#1`, `#2`, `#42`) that clients can enter into any browser.
* **Zero-Wallet Client Experience**: Clients query the blockchain state directly through high-performance RPC endpoints—no wallet connection, signatures, or crypto required.
* **Smart Contract Sovereignty**: Only the creator wallet can alter the quote status to `Accepted` or `Rejected`. Once a quote is accepted or rejected, the state machine finalizes the record permanently.

---

## 4. Key Value Propositions

| Feature | Freelancer / Business | Client / Customer |
| :--- | :--- | :--- |
| **Integrity** | Immutable proof of quoted terms and price | Assurance that quoted terms cannot be silently modified |
| **Simplicity** | One-page dashboard to track all created quotes | Instant lookup by entering a simple numeric ID |
| **Accessibility** | Works with standard Web3 wallets (MetaMask) | No wallet or crypto needed to view records |
| **Cost Efficiency** | Minimal gas footprint on Botchain Mainnet | Zero cost to verify quotes |

---

## 5. Technical Architecture

### 5.1 Smart Contract Layer (`PricePad.sol`)
* **Language**: Solidity `^0.8.20`
* **Standards**: EVM compatible, gas-optimized compiler (`200` runs)
* **Access Control**: Strict creator validations using custom errors (`NotCreator()`, `InvalidPrice()`, `EmptyName()`, `InvalidStatusChange()`)
* **State Machine**:
  ```text
  [ Available (0) ] ──> [ Accepted (1) ] (Finalized)
         │
         └─────────────> [ Rejected (2) ] (Finalized)
  ```

### 5.2 Frontend & Middleware Layer
* **Framework**: Next.js 14 (App Router)
* **Type Safety**: End-to-end TypeScript
* **Design System**: Tailwind CSS (dark charcoal theme `#0f1015` with muted purple and emerald accents)
* **Blockchain Interactivity**: `wagmi v2` and `viem` for optimized RPC calls and state caching
* **Web3 Integration**: Injected EIP-1193 connector (MetaMask) with automatic Botchain Mainnet (Chain ID 677) network switching

---

## 6. Tokenomics & Business Model

PricePad adopts a utility-first expansion model:

1. **Protocol Micro-Fees (Future)**: Optional nominal micro-fee upon contract quote creation or escrow settlement.
2. **Featured & Verified Creator Badges**: Optional on-chain reputation score for freelancers with proven completion records.
3. **Escrow & Milestone Settlement**: Optional smart-contract-secured payments held until milestones are approved by the client in BOT.

---

## 7. Strategic Roadmap

```text
Phase 1: Foundation (Completed)
├── Core Smart Contract Design & Hardhat Testing
├── Botchain Mainnet Deployment (0x547b29eB85705c4781FcdD935A97aC7024924CE6)
├── On-Chain Explorer Verification on scan.botchain.ai
└── Fully Functional Next.js 14 Frontend

Phase 2: Client Engagement (Q1 2027)
├── Client Signature / Digital Acceptance (EIP-712 off-chain or on-chain)
├── Shareable Direct Links (pricepad.app/record/42)
├── Automated PDF/Receipt Export from on-chain event logs

Phase 3: Settlement & Ecosystem (Q2 2027)
├── Milestone-based Escrow Payments in BOT & stablecoins
├── Freelancer Portfolio & Verified Rating System
```

---

## 8. Verification & Live Links

* **Whitepaper & Pitch Cloud Link**: [https://github.com/liljhnxn/pricepad/blob/main/WHITEPAPER.md](https://github.com/liljhnxn/pricepad/blob/main/WHITEPAPER.md)
* **Smart Contract Code**: [https://scan.botchain.ai/address/0x547b29eB85705c4781FcdD935A97aC7024924CE6#code](https://scan.botchain.ai/address/0x547b29eB85705c4781FcdD935A97aC7024924CE6#code)
* **Source Repository**: [https://github.com/liljhnxn/pricepad](https://github.com/liljhnxn/pricepad)
* **Network**: Botchain Mainnet (Chain ID `677`)
* **RPC Endpoint**: `https://rpc.botchain.ai`
