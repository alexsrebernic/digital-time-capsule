import { useState, useEffect } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useSolana } from '@/components/SolanaProvider';
import { initializeCapsuleMachine } from '@/utils/solanaUtils';

export function useCapsuleMachine() {
  const [capsuleMachinePublicKey, setCapsuleMachinePublicKey] = useState<PublicKey | null>(null);
  const { program, provider } = useSolana();

  useEffect(() => {
    const initializeMachine = async () => {
      if (program && provider) {
        try {
          // Check if we already have a capsule machine initialized
          const storedPublicKey = localStorage.getItem('capsuleMachinePublicKey');
          if (storedPublicKey) {
            setCapsuleMachinePublicKey(new PublicKey(storedPublicKey));
          } else {
            // If not, initialize a new one
            const newMachinePublicKey = await initializeCapsuleMachine(program, provider);
            localStorage.setItem('capsuleMachinePublicKey', newMachinePublicKey.toBase58());
            setCapsuleMachinePublicKey(newMachinePublicKey);
          }
        } catch (error) {
          console.error('Error initializing capsule machine:', error);
        }
      }
    };

    initializeMachine();
  }, [program, provider]);

  return capsuleMachinePublicKey;
}