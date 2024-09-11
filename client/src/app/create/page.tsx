"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DigitalTimeCapsuleForm } from "@/components/interfaces/digital-time-capsule-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";
import { uploadToPinata } from "@/utils/pinataUtils";
import { useSolana } from "@/components/SolanaProvider";
import { PublicKey } from "@solana/web3.js";

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

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async (data: CapsuleData) => {
    setIsSubmitting(true);
    try {
      if (!program || !provider) {
        throw new Error("Solana connection not initialized");
      }

      const ipfsHash = await uploadToPinata(data);
      console.log("IPFS Hash:", ipfsHash);

      const releaseDate = Math.floor(new Date(data.openingDate).getTime() / 1000);

      // Placeholder for contract interaction
      // Replace this with actual contract call when available
      console.log("Creating capsule with data:", { ipfsHash, releaseDate });
      // const capsulePda = await program.methods.createCapsule(new BN(releaseDate), ipfsHash)
      //   .accounts({
      //     // Add necessary accounts here
      //   })
      //   .rpc();

      // For now, we'll use a mock PDA
      const mockPda = PublicKey.unique();

      console.log("Capsule created with PDA:", mockPda.toBase58());

      // Navigate to success page or capsule view
      router.push(`/capsule/${mockPda.toBase58()}`);
    } catch (error) {
      console.error("Error creating capsule:", error);
      // Handle error (show error message to user)
    } finally {
      setIsSubmitting(false);
    }
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