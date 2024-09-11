"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TimeCapsuleView } from "@/components/interfaces/time-capsule-view";
import { Header } from "@/components/ui/header";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";
import { useSolana } from "@/components/SolanaProvider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface CapsuleData {
  title: string;
  status: "sealed" | "opened";
  openingDate: string;
  contents: { type: "text" | "image"; content: string }[];
  isOwner: boolean;
}

export default function CapsulePage() {
  const { id } = useParams();
  const [capsuleData, setCapsuleData] = useState<CapsuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const { program, provider } = useSolana();
  const { connected, connecting, disconnecting, wallet } = useWallet();
  const router = useRouter();

  useEffect(() => {
    console.log("CapsulePage effect triggered");
    console.log("Wallet state:", { connected, connecting, disconnecting, wallet: wallet ? "exists" : "null" });
    console.log("Solana state:", { program: !!program, provider: !!provider });

    const fetchCapsuleData = async () => {
      if (!connected) {
        console.log("Wallet not connected, cannot fetch data");
        setLoading(false);
        return;
      }
      
      if (!program || !provider) {
        console.log("Solana connection not initialized, cannot fetch data");
        setLoading(false);
        return;
      }
      try {
        // Placeholder for fetching capsule data from the contract
        console.log("Fetching capsule data for ID:", id);

        // Mock data for now
        const mockCapsuleData: CapsuleData = {
          title: "My Time Capsule",
          status: "sealed",
          openingDate: new Date(Date.now() + 86400000).toISOString(),
          contents: [
            { type: "text", content: "This is a memory from 2023..." },
            { type: "image", content: "placeholder.com?height=300&width=400" },
          ],
          isOwner: true
        };

        setCapsuleData(mockCapsuleData);
      } catch (error) {
        console.error("Error fetching capsule data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsuleData();
  }, [id, program, provider, connected, connecting, disconnecting, wallet]);
  const handleGoBack = () => {
    router.back();
  };
  if (!connected) {
    return(
      <>
        <Header black />
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="inline-flex items-center text-black hover:text-gray-800 transition-colors duration-200 my-6 ml-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Go Back</span>
        </Button>
        <div>
          <h1 className="text-center font-medium text-3xl">Please connect your wallet to view this capsule</h1>
        </div>
    </>
    )
  }

  if (loading) {
    return   (
      <>
        <Header black />
        <Button
          onClick={handleGoBack}
          variant="ghost"
          className="inline-flex items-center text-black hover:text-gray-800 transition-colors duration-200 my-6 ml-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Go Back</span>
        </Button>
        <div>
          <h1 className="text-center font-medium text-3xl">Loading...</h1>
        </div>
      </>
    )
 
  }


  return (
    <AuthGuardRedirect>
      <Header black />
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="inline-flex items-center text-black hover:text-gray-800 transition-colors duration-200 my-6 ml-6"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        <span>Go Back</span>
      </Button>
      {capsuleData && <TimeCapsuleView {...capsuleData} />}
    </AuthGuardRedirect>
  );
}