# CertiChain - Certificate Issuance & Verification System 🎓

**CertiChain** is a decentralized platform designed to modernize academic credentialing. By leveraging the **Stellar Blockchain**, it provides a secure, immutable, and transparent way for institutions to issue certificates and for employers/students to verify them instantly.

---

## 🎓 Overview

This project provides a robust solution for educational institutions to issue digital certificates that are cryptographically secured. Unlike traditional digital PDFs, CertiChain credentials are "anchored" to the Stellar ledger, making forgery virtually impossible.

### Platform Details
- **Institution Portal**: A secure dashboard for admins to issue and manage student records.
- **Verification Portal**: A public tool for real-time authenticity checks using blockchain hashes.
- **Network**: Integrated with the **Stellar Testnet** for high-speed, low-cost on-chain transactions.

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 (Vite), Tailwind CSS 4, Framer Motion
- **Blockchain**: Stellar SDK (Soroban Ready)
- **Backend/Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Google Auth

### System Components
1. **Issuer (Institution)**: Authenticated schools that create and sign certificate metadata.
2. **On-Chain Record**: Each certificate is linked to a Stellar transaction hash.
3. **Off-Chain Storage**: Detailed student metadata is stored securely in Firestore for fast retrieval.

---

## 📁 Project Structure

```text
/src
  /components     # Reusable UI (Hero, Dashboard, VerifyPortal)
  /lib            # Logic for Firebase & Stellar SDK
  /types.ts       # Global TypeScript interfaces
  App.tsx         # Main Routing & Application Shell
  main.tsx        # Entry point
/firebase.rules   # Hardened ABAC security rules
metadata.json     # App manifest
package.json      # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Firebase Account (Project configured)
- Stellar Testnet Account

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure `.env` with your Firebase & Stellar credentials
4. Start the dev server: `npm run dev`

---

## 📋 Features

### Phase 1: Institution Portal (Active)
- **Google Login**: Secure access for verified institutional administrators.
- **Certificate Issuance**: One-click generation of student credentials.
- **Stellar Integration**: Automatic broadcasting of issuance events to the Stellar network.
- **Registry Management**: Searchable database of all issued documents.

### Phase 2: Verification Portal (Active)
- **Instant Search**: Verify credentials using only the Certificate ID.
- **Blockchain Cross-Check**: Real-time validation against the Stellar ledger.
- **Immutable Proof**: Displays the detailed cryptographic hash for each document.

---

## 🔐 Certificate ID Format
Certificates follow a standardized, secure format:
`CERT-[RANDOM_ALPHANUMERIC_STRING]`
Example: `CERT-K9P2X4M7L`

---

## 📊 Data Storage

### On-Chain (Stellar Blockchain)
- **Transaction Hash**: Acts as the immutable fingerprint of the certificate.
- **Memo Data**: Stores the unique Certificate ID for public verification lookup.

### Off-Chain (Firestore)
- **Student Data**: Name, degree, and issue date.
- **Relational Data**: Link between the institution and the issued records.

---

## 🔒 Security Features
- **Identity Integrity**: Institutions can only manage records they created.
- **Anti-Update Gate**: Core certificate fields are immutable after issuance.
- **Verified Signatures**: Only registered institutions can broadcast to the ledger.

---

## 🛠️ Development

### Core Functions
- `issueCertificateOnStellar()`: Handles ledger interaction.
- `verifyOnStellar()`: Fetches transaction data from Horizon.
- `handleFirestoreError()`: Standardized error reporting for DB operations.

---

## 📝 License
This project is licensed under the Apache-2.0 License.

## 👥 Contributors
- Developed by CertiChain Team.

## 📞 Support
For any issues, contact the system administrator or check the developer console.
<img width="949" height="442" alt="image" src="https://github.com/user-attachments/assets/7a5c73bf-6a08-4446-aba6-36f62e93e793" />
<img width="1895" height="1002" alt="image" src="https://github.com/user-attachments/assets/5553481f-9c9f-42d0-b129-ff3301efb85a" />
