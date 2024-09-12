"use client"
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, web3 } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Contract } from '@/models/contract';
import { PROGRAM_ID } from '@/utils/solanaUtils';
import idl from '@/utils/contract.json';

interface SolanaContextType {
  program: Program<Contract> | null;
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
// Extend AnchorProvider with sendAndConfirm method

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const { connected } = useWallet();

  const provider = useMemo(() => {
    if (wallet) {
      return new AnchorProvider(connection, wallet, {
        preflightCommitment: 'processed',
        commitment: 'processed'
      });
    }
    return null;
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (provider) {
      return new Program(idl as Idl, PROGRAM_ID as any, provider as any) as unknown as Program<Contract>;
    }
    return null;
  }, [provider]);

  useEffect(() => {
    if (program) {
      connection.onLogs(PROGRAM_ID, console.log);
    }
  }, [program, connection]);

  return (
    <SolanaContext.Provider value={{ program, provider }}>
      {children}
    </SolanaContext.Provider>
  );
};