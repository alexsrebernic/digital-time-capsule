import Image from "next/image";
import { HomePage } from "@/components/interfaces/home-page";
import { DigitalTimeCapsuleForm } from "@/components/interfaces/digital-time-capsule-form";
import { MyCapsules } from "@/components/interfaces/my-capsules";
import { Header } from "@/components/ui/header";
import { UserProfile } from "@/components/interfaces/user-profile";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";

export default function UserProfilePage() {
	return (
		<AuthGuardRedirect>
			<Header black></Header>
			<UserProfile />
		</AuthGuardRedirect>
	);
}
