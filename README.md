# PricePad

> Simple pricing. Easy sharing.

PricePad is a clean, simple, and fully functional Web3 pricing application designed for freelancers and small business owners. It enables creators to define immutable price quotes for their products or services on the blockchain and share a unique numeric ID with customers. Customers can view and verify quotes directly without needing a wallet, while creators maintain sovereign control over updating the status of their records.

---

## Features

- **Decentralized Price Records**: Create verifiable, immutable pricing records directly on the **Botchain Testnet**.
- **Unique Numeric IDs**: Every record receives an easy-to-read sequential ID (e.g., `#1`, `#2`, `#3`) that can be copied with one click.
- **Customer Lookup Without a Wallet**: Customers can paste any Record ID and retrieve details immediately via direct RPC reads.
- **Creator Access Controls**: Smart contract enforces that only the record creator can mark an offer as **Accepted** or **Rejected**.
- **Wallet & Network Integration**: Automatic network switching to Botchain Testnet (Chain ID `968`), MetaMask compatibility, and clear transaction lifecycle states.
- **Dark Charcoal Minimalist UI**: Crafted with Tailwind CSS using dark charcoal surfaces with muted purple and green accents.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Smart Contract**: Solidity `^0.8.20`
- **Smart Contract Tooling**: Hardhat & `@nomicfoundation/hardhat-toolbox`
- **Web3 Libraries**: `wagmi` & `viem`
- **Wallet**: MetaMask / Injected EIP-1193 Web3 Providers
- **Icons**: Lucide React

---

## Blockchain Configuration

| Parameter | Value |
| :--- | :--- |
| **Network** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |
| **Currency** | `BHR` |

---

## Smart Contract (`contracts/PricePad.sol`)

### Record Structure
```solidity
enum Status {
    Available, // 0
    Accepted,  // 1
    Rejected   // 2
}

struct Record {
    uint256 id;
    address creator;
    string name;
    string description;
    uint256 price;
    Status status;
    uint256 createdAt;
}
```

### Core Functions
- `createRecord(string name, string description, uint256 price)`: Validates non-empty name and price > 0, generates a unique ID, sets status to `Available`, and emits `RecordCreated`.
- `updateStatus(uint256 id, Status newStatus)`: Restricted to the record creator. Updates status to `Accepted` or `Rejected`. Once finalized, status cannot be mutated again.
- `getRecord(uint256 id)`: Public view function to fetch record details by ID.
- `getMyRecords()`: Returns all records created by `msg.sender`.
- `getTotalRecords()`: Returns the total count of records created.

---

## Project Structure

```text
pricepad/
├── app/
│   ├── globals.css          # Dark charcoal styling & typography
│   ├── layout.tsx           # Root layout with Wagmi & React Query providers
│   ├── page.tsx             # One-page application interface
│   └── providers.tsx        # Wagmi and React Query client providers
├── components/
│   ├── CreateRecord.tsx     # Form to create records + success ID display
│   ├── FindRecord.tsx       # Public lookup by ID (no wallet required)
│   ├── Header.tsx           # Logo, tagline, network check, wallet connect
│   ├── MyRecords.tsx        # Creator's record dashboard & status updates
│   └── StatusBadge.tsx      # Badges for Available, Accepted, Rejected
├── contracts/
│   └── PricePad.sol         # Solidity smart contract
├── lib/
│   ├── chains.ts            # Botchain Testnet chain definition
│   ├── contract.ts          # Contract ABI & address resolver
│   ├── types.ts             # TypeScript interfaces & enums
│   ├── utils.ts             # Price, date, address, and error formatters
│   └── wagmi.ts             # Wagmi client configuration
├── scripts/
│   └── deploy.js            # Hardhat deployment script for Botchain
├── test/
│   └── PricePad.test.js     # Comprehensive smart contract test suite
├── hardhat.config.js        # Hardhat configuration (Solidity 0.8.20)
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Charcoal, purple, and green theme
└── package.json
```

---

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
# Deployment private key (keep secret!)
PRIVATE_KEY=your_testnet_private_key_without_0x_or_with_0x

# Botchain Testnet
NEXT_PUBLIC_CHAIN_ID=968
NEXT_PUBLIC_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_EXPLORER_URL=https://scan.bohr.life

# Deployed Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

---

## Testing Smart Contracts

Run the test suite using Hardhat:

```bash
npm test
```

Tests cover:
- Record creation & event emission
- Sequential unique ID generation
- Rejection of empty product/service names
- Rejection of zero prices
- Record retrieval by ID & handling non-existent IDs
- Querying caller-specific records (`getMyRecords`)
- Creator-only status updates (`Accepted` and `Rejected`)
- Rejection of unauthorized status updates
- Prevention of invalid status transitions (e.g. reverting to `Available` or modifying a finalized record)

---

## Deploying to Botchain Testnet

1. Ensure your deployer account on Botchain Testnet has `BHR` testnet funds.
2. Run the deployment script:

```bash
npm run deploy
```

The script will automatically output the contract address and write `NEXT_PUBLIC_CONTRACT_ADDRESS` to `.env.local`.

---

## Running the Web Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Security & Privacy Considerations

- **No Off-Chain Sensitive Data**: No customer personal identities, phone numbers, or passwords are stored.
- **On-Chain Enforcement**: Creator access permissions and state transition guards are strictly verified in EVM bytecode via custom errors.
- **Read Decoupling**: Record lookups are public and do not prompt users for signatures or wallet authorizations.

