import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWalletProvider } from "@/components/AppWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Digital Time Capsule",
	description: "Preserve your memories for the future, securely and creatively",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<AppWalletProvider>{children}</AppWalletProvider>
			</body>
		</html>
	);
}
