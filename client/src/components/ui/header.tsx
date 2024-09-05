"use client";

import Link from "next/link";
import Image from "next/image";
import logoBlack from "@/assets/logo-black.png";
import logoWhite from "@/assets/logo-white.png";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import WalletAddress from "./walletAddress";

export function Header({ black = false }) {
	const textColor = black ? "text-black" : "text-white";
	const hoverColor = black ? "hover:text-gray-700" : "hover:text-gray-300";
	const logoSrc = black ? logoBlack : logoWhite;
	const { connected, publicKey } = useWallet();

	return (
		<header
			className={`px-4 lg:px-6 h-14 flex items-center ${
				black ? "bg-white" : "bg-transparent"
			}`}
		>
			<Link className="flex items-center justify-center" href="/">
				<span className="sr-only">Digital Time Capsule</span>
				<Image
					src={logoSrc}
					alt="Digital Time Capsule Logo"
					width={50}
					height={50}
				/>
			</Link>
			<nav className="ml-auto flex gap-4 sm:gap-6 items-center">
				<Link
					className={`text-sm font-medium ${textColor} ${hoverColor} hover:underline underline-offset-4 transition-colors duration-200`}
					href="/"
				>
					Home
				</Link>
				<Link
					className={`text-sm font-medium ${textColor} ${hoverColor} hover:underline underline-offset-4 transition-colors duration-200`}
					href="/about"
				>
					About
				</Link>
				{connected && (
					<Link
						className={`text-sm font-medium ${textColor} ${hoverColor} hover:underline underline-offset-4 transition-colors duration-200`}
						href="/profile"
					>
						Profile
					</Link>
				)}
				{connected && (
					<WalletMultiButton className={`${connected ? "ml-4" : ""}`}>
						<span className="sm:hidden w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
						<div className="hidden sm:block">
							<WalletAddress
								address={publicKey?.toBase58()}
								splitAddress
							></WalletAddress>
						</div>
					</WalletMultiButton>
				)}
			</nav>
		</header>
	);
}
