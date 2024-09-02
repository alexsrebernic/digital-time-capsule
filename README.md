
# Digital Time Capsule

## Overview

Digital Time Capsule is a decentralized application (dApp) built on the Solana blockchain that allows users to create, manage, and share time-locked digital capsules. These capsules can contain messages, images, and other digital content that are securely stored and can only be accessed at a predetermined future date.

## Features

- **Message and Image Storage**: Store text messages and image references securely on the Solana blockchain.
- **Time-based Access Control**: Set a future date for capsule opening, ensuring content remains private until then.
- **Multi-user Capsules**: Collaborate with friends to create shared memory capsules.
- **NFT Integration**: Each capsule is represented by a unique NFT, proving ownership and enabling potential trading.
- **Encrypted Content**: Securely encrypt capsule contents for privacy.
- **Program Derived Addresses (PDAs)**: Utilize PDAs for efficient capsule management and access.

## Project Structure

The project is organized into two main folders:

- `client/`: Contains the Next.js frontend application
- `contracts/`: Contains the Solana program written using Anchor

## System Architecture

Here's a high-level overview of the Digital Time Capsule system architecture:

<antArtifact identifier="updated-system-architecture" type="application/vnd.ant.mermaid" title="Updated Digital Time Capsule System Architecture">
graph TD
    A[User] -->|Interacts with| B[Web Interface]
    B -->|Connects to| C[Solana Wallet]
    B -->|Sends transactions| D[Solana Blockchain]
    D -->|Stores data| E[Time Capsule Program]
    E -->|Manages| F[Capsule PDAs]
    E -->|Interacts with| G[SPL Token Program]
    E -->|Interacts with| H[Metaplex NFT Program]
    B -->|Requests data| I[Off-chain Storage for Images]
    J[Time Oracle] -->|Provides time data| D
    E -->|Uses| K[On-chain Encryption]
    L[Capsule Contributors] -->|Collaborate on| F


## Technical Stack

- Solana Blockchain
- Rust (for Solana programs)
- Anchor Framework
- Next.js (for frontend)
- React.js
- Metaplex (for NFT functionality)

## Getting Started

### Prerequisites

- Rust and Cargo
- Solana CLI tools
- Node.js and npm
- Anchor Framework

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/digital-time-capsule.git
   cd digital-time-capsule
   ```

2. Install dependencies for the Solana program:
   ```
   cd contracts
   anchor build
   ```

3. Deploy the program to a Solana cluster (e.g., devnet):
   ```
   anchor deploy
   ```

4. Install dependencies for the frontend:
   ```
   cd ../client
   npm install
   ```

5. Start the frontend development server:
   ```
   npm run dev
   ```

## Usage

[Provide brief instructions on how to use the dApp, create a capsule, etc.]

## Contributing

We welcome contributions to the Digital Time Capsule project! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Solana Foundation
- Metaplex
- [Any other acknowledgments]

## Contact

Alex Srebernic - [@your_twitter](https://twitter.com/your_twitter) - alexsrebernic@gmail.com

Project Link: [https://github.com/alexsrebernic/digital-time-capsule](https://github.com/alexsrebernic/digital-time-capsule)
