import Image from "next/image";
import { HomePage } from "@/components/home-page";
import { DigitalTimeCapsuleForm } from "@/components/digital-time-capsule-form";
import { TimeCapsuleView } from "@/components/time-capsule-view";
import { Header } from "@/components/ui/header";
export default function Home() {
  return (
    <>
        <Header/>
        <TimeCapsuleView/>
    </>
  );
}
