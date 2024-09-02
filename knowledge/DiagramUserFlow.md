```mermaid
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
```