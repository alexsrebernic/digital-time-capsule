"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";

interface AuthGuardProps {
	children: ReactNode;
}

export const AuthGuardRedirect: React.FC<AuthGuardProps> = ({ children }) => {
	const { connected, publicKey } = useWallet();
	const router = useRouter();

	useEffect(() => {
		if (!connected || !publicKey) {
			router.replace("/");
		}
	}, [connected, publicKey, router]);

	// If not mounted or not connected, render nothing
	if (!connected || !publicKey) {
		return null;
	}

	return <>{children}</>;
};
