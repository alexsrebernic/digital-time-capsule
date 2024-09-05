import { MyCapsules } from "@/components/interfaces/my-capsules";
import { Header } from "@/components/ui/header";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";

export default function MyCapsulesPage() {
	return (
		<AuthGuardRedirect>
			<Header black />
			<MyCapsules />
		</AuthGuardRedirect>
	);
}
