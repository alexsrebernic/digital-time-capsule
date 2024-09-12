"use client";

import { useState, useEffect } from "react";
import { MyCapsules } from "@/components/interfaces/my-capsules";
import { Header } from "@/components/ui/header";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";
import { useSolana } from "@/components/SolanaProvider";
import { PublicKey } from "@solana/web3.js";
import { CapsuleData } from "@/models/CapsuleData";

export default function MyCapsulesPage() {
  const [capsules, setCapsules] = useState<CapsuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const { program, provider } = useSolana();

  useEffect(() => {
    const fetchCapsules = async () => {
      if (program && provider) {
        try {
          // Placeholder for fetching capsules from the contract
          // Replace this with actual contract call when available
          console.log("Fetching capsules for user:", provider.publicKey?.toBase58());
          
          // Mock data for now
          const mockCapsules: CapsuleData[] = [
            {
              id: 1,
              title: "My First Capsule",
              creationDate: new Date().toISOString(),
              openingDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
              status: "sealed"
            },
            {
              id: 2,
              title: "Opened Capsule",
              creationDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              openingDate: new Date().toISOString(),
              status: "opened"
            }
          ];

          setCapsules(mockCapsules);
          setLoading(false);

        } catch (error) {
          console.error("Error fetching capsules:", error);
          // Handle error (show error message to user)
        } finally {
          console.log("Capsules fetched")
          setLoading(false);
        }
      }
    };
    console.log(program,provider)
    fetchCapsules();
  }, [program, provider]);

  return (
    <AuthGuardRedirect>
      <Header black />
      <MyCapsules capsules={capsules} loading={loading} />
    </AuthGuardRedirect>
  );
}