import { Copy } from "lucide-react";
import React, { useState } from "react";

interface WalletAddressProps {
	address?: string | null;
	allowCopy?: boolean;
	splitAddress?: boolean;
}

export default function WalletAddress({
	address = null,
	allowCopy,
	splitAddress,
}: WalletAddressProps) {
	function copyContractToClipboard() {
		if (address) {
			navigator.clipboard.writeText(address);
		}
	}

	function cutContract(ca: string | null): string | null {
		if (!ca) return null;
		return `${ca.slice(0, 4)}...${ca.slice(-4)}`;
	}

	return (
		<div
			onClick={allowCopy ? copyContractToClipboard : undefined}
			className={`flex white-space-nowrap uppercase ${
				allowCopy ? "cursor-pointer hover:opacity-40" : ""
			}`}
		>
			<span className="tracking-wider color-black">
				{splitAddress ? cutContract(address) : address}
			</span>

			{allowCopy && <Copy className="w-5 h-5 text-third ml-2" />}
		</div>
	);
}
