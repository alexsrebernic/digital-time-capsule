"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MockProgram } from '@/mocks/MockProgram';
// Placeholder for the contract type
type PlaceholderContract = {
  // Add placeholder methods and properties here
  // For example:
  // createCapsule: (args: any) => Promise<any>;
  // retrieveCapsule: (args: any) => Promise<any>;
};
interface SolanaContextType {
  program: MockProgram | null;
  provider: AnchorProvider | null;
}

const SolanaContext = createContext<SolanaContextType | null>(null);


export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [program, setProgram] = useState<MockProgram | null>(null);
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { connected } = useWallet();


  useEffect(() => {
    console.log("SolanaProvider effect triggered");
    console.log("Wallet:", wallet ? "exists" : "null");
    console.log("Connection:", connection ? "exists" : "null");
    console.log("Connected:", connected);

    if (wallet && connected) {
      console.log("Attempting to initialize Solana connection");
      const newProvider = new AnchorProvider(connection, wallet, {});
      setProvider(newProvider);
      setProgram(new MockProgram());
      console.log("Solana connection initialized");
    } else {
      console.log("Conditions not met for Solana connection");
      setProvider(null);
      setProgram(null);
    }
  }, [wallet, connection, connected]);

  const contextValue = useMemo(() => ({
    program,
    provider,
  }), [program, provider]);

 

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
};