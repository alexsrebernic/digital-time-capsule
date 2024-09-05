"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Edit, Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletAddress from "../ui/walletAddress";

export function UserProfile() {
	const { publicKey } = useWallet();

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cGF0aCBkPSJNNDUuNSw0OGMzLjUsMy41LDMuNSw5LjIsMCwxMi43Yy0zLjUsMy41LTkuMiwzLjUtMTIuNywwYy0zLjUtMy41LTMuNS05LjIsMC0xMi43QzM2LjMsNDQuNSw0Miw0NC41LDQ1LjUsNDh6IiBmaWxsPSIjZjBmMGYwIj48L3BhdGg+CjxwYXRoIGQ9Ik0xNS41LDE4YzMuNSwzLjUsMy41LDkuMiwwLDEyLjdjLTMuNSwzLjUtOS4yLDMuNS0xMi43LDBjLTMuNS0zLjUtMy41LTkuMiwwLTEyLjdDNi4zLDE0LjUsMTIsMTQuNSwxNS41LDE4eiIgZmlsbD0iI2YwZjBmMCI+PC9wYXRoPgo8L3N2Zz4=')]">
			<div className="container mx-auto py-8 px-4 max-w-4xl">
				<Card className="mb-8">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
							<Avatar className="w-24 h-24">
								<AvatarImage
									src="/placeholder.svg?height=96&width=96"
									alt="User Avatar"
								/>
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
							<div className="text-center md:text-left">
								<h1 className="text-2xl font-bold mb-2">
									{publicKey ? (
										<WalletAddress
											address={publicKey.toBase58()}
											splitAddress
										/>
									) : (
										"no wallet connected"
									)}
								</h1>
								<p className="text-muted-foreground mb-4">
									Time traveler, memory keeper, and digital archivist.
									Preserving moments for future generations.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-8 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Capsule Statistics</CardTitle>
						</CardHeader>
						<CardContent>
							<dl className="grid grid-cols-2 gap-4 text-center">
								<div>
									<dt className="text-sm font-medium text-muted-foreground">
										Total Created
									</dt>
									<dd className="text-2xl font-semibold">42</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-muted-foreground">
										Opened
									</dt>
									<dd className="text-2xl font-semibold">18</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-muted-foreground">
										Collaborations
									</dt>
									<dd className="text-2xl font-semibold">7</dd>
								</div>
								<div>
									<dt className="text-sm font-medium text-muted-foreground">
										Days Until Next
									</dt>
									<dd className="text-2xl font-semibold">23</dd>
								</div>
							</dl>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Account Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Button className="w-full justify-start" variant="outline">
									<Edit className="mr-2 h-4 w-4" />
									Edit Profile
								</Button>
								<Button className="w-full justify-start" variant="outline">
									<Bell className="mr-2 h-4 w-4" />
									Manage Notifications
								</Button>
								{/*<Button className="w-full justify-start" variant="outline">
									<Wallet className="mr-2 h-4 w-4" />
									Connect Wallet
								</Button>*/}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
