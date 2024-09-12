"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DigitalTimeCapsuleForm } from "@/components/interfaces/digital-time-capsule-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";
import { uploadToPinata } from "@/utils/pinataUtils";
import { useSolana } from "@/components/SolanaProvider";
import { PublicKey } from "@solana/web3.js";
import { useCapsuleMachine } from "@/hooks/useCapsuleMachine";
import { createCapsule } from "@/utils/solanaUtils";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

interface CapsuleData {
  title: string;
  description: string;
  openingDate: string;
  files: File[];
}

export default function CreateDigitalTimeCapsuleForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { program, provider } = useSolana();
  const capsuleMachinePublicKey = useCapsuleMachine()
  const wallet = useAnchorWallet()

  const handleSubmit = async (data: CapsuleData) => {
    setIsSubmitting(true);
    try {
      if (!program || !provider || !wallet || !capsuleMachinePublicKey) {
        throw new Error("Solana connection not initialized, wallet not connected, or capsule machine not ready");
      }

      const ipfsHash = await uploadToPinata(data);
      console.log("IPFS Hash:", ipfsHash);

      const releaseDate = Math.floor(new Date(data.openingDate).getTime() / 1000);

      const capsulePda = await createCapsule(
        program,
        provider,
        capsuleMachinePublicKey,
        ipfsHash,
        releaseDate
      );

      console.log("Capsule created with PDA:", capsulePda.toBase58());

      // Navigate to success page or capsule view
      router.push(`/capsule/${capsulePda.toBase58()}`);
    } catch (error) {
      console.error("Error creating capsule:", error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoBack = () => {
    router.back();
  };
  return (
    <AuthGuardRedirect>
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="inline-flex items-center text-black hover:text-gray-800 transition-colors duration-200 my-6 ml-6"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span>Go Back</span>
      </Button>

      <DigitalTimeCapsuleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AuthGuardRedirect>
  );
}