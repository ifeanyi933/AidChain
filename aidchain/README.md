# AidChain – Decentralized Humanitarian Aid Verifier

AidChain is a blockchain-powered system that brings transparency and accountability to the humanitarian aid ecosystem. It allows verified organizations to distribute aid, and ensures that only eligible, approved entities can participate—enforcing trust through smart contracts written in Clarity.

---

## 🌍 Overview

This project focuses on building a decentralized infrastructure for managing humanitarian aid distribution, using **Clarity smart contracts** on the Stacks blockchain. AidChain consists of the following key components:

- ✅ **Aid Verifier Contract**: Manages verified organizations and admin controls
- 🔐 **Access Control Logic**: Restricts actions to verified organizations
- 🧪 **Test Suite**: Comprehensive mock-based testing with Vitest

---

## 🧠 Smart Contract: `aid-verifier.clar`

The `aid-verifier` contract forms the core of the system. It maintains a registry of approved aid-distributing organizations and enforces admin rights.

### 🔑 Key Functions

| Function | Description |
|---------|-------------|
| `add-org` | Adds a new organization to the verified registry (admin-only) |
| `remove-org` | Removes an organization from the registry (admin-only) |
| `is-verified-org` | Checks if a principal is a verified organization |
| `transfer-admin` | Transfers administrative control to another principal |
| `get-admin` | Returns the current admin principal |
| `get-orgs-count` | Returns the total number of verified organizations |
| `get-orgs` | Returns a list of all verified organizations |

---

## 🔒 Access Control

The smart contract uses a robust admin system to restrict sensitive actions like adding or removing organizations. Only the admin address set at deployment (or transferred via `transfer-admin`) can manage the registry.

All read-only functions (e.g. `get-orgs`, `is-verified-org`) are publicly accessible.

---

## 🧪 Testing

AidChain is tested using **Vitest**, with mock environments for simulating Clarity calls and state transitions.

### 📁 Test Structure

Tests are located in the `tests/` directory and cover:

- Adding and removing organizations
- Admin transfers
- Querying verification status
- Rejection of unauthorized actions

To run the test suite:

```bash
npm install
npm test
```

Make sure you have Vitest configured properly in your tsconfig.json and package.json.

## 🚀 Getting Started
### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AidChain.git
cd AidChain/aidchain
```

### Install dependencies

```bash
npm install
```

### Run the tests

```bash
npm run test
```

### Validate the contract with Clarinet

```bash
clarinet check
```

### 📦 File Structure
```bash
aidchain/
├── contracts/
│   └── aid-verifier.clar       # Clarity smart contract
├── tests/
│   └── aid-verifier.test.ts    # Vitest unit tests
├── clarinet.json               # Clarinet project config
├── README.md                   # Project overview
└── package.json                # NPM dependencies and scripts
```

## ⚖️ License
This project is licensed under the MIT License.

## 🤝 Contributing
Pull requests and feature suggestions are welcome. If you're interested in extending AidChain (e.g., to support donation tracking or recipient validation), please open an issue or fork the repo!

## 🌐 Future Plans
📦 Integrate with a donation tracking contract
📊 Add data visualization for verification status
🔗 Deploy to mainnet using Stacks blockchain tools

