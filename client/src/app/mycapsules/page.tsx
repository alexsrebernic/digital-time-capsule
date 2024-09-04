import Image from "next/image";
import { MyCapsules } from "@/components/interfaces/my-capsules";
import { Header } from "@/components/ui/header";
export default function MyCapsulesPage() {
  return (
    <>
    <Header black/>
    <MyCapsules/>
    </>
    
  );
}
