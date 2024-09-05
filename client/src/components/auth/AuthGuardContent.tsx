import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { ReactNode } from "react";

interface AuthGuardContentProps {
	text?: string;
	children: ReactNode;
	showConnectWallet?: boolean;
}

const AuthGuardContent: React.FC<AuthGuardContentProps> = ({
	text,
	children,
	showConnectWallet,
}) => {
	const { publicKey } = useWallet();

	if (!publicKey) {
		return (
			<div className="text-center">
				{text && <p className="mb-4">{text}</p>}
				{showConnectWallet && (
					<WalletMultiButton>Connect Wallet</WalletMultiButton>
				)}
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthGuardContent;
