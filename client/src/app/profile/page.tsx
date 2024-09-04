import Image from "next/image";
import { HomePage } from "@/components/home-page";
import { DigitalTimeCapsuleForm } from "@/components/digital-time-capsule-form";
import { MyCapsules } from "@/components/my-capsules";
import { Header } from "@/components/ui/header";
import { UserProfile } from "@/components/user-profile";
export default function UserProfilePage() {
  return (
    <>
    <Header black/>
    <UserProfile/>
    </>
    
  );
}
