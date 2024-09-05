import { TimeCapsuleView } from "@/components/interfaces/time-capsule-view";
import { Header } from "@/components/ui/header";
import { AuthGuardRedirect } from "@/components/auth/AuthGuardRedirect";

export default function TimeCapsulePage() {
	return (
		<AuthGuardRedirect>
			<Header />
			<TimeCapsuleView />
		</AuthGuardRedirect>
	);
}
