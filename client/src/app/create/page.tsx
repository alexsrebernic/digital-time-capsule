"use client"
import Image from "next/image";
import { HomePage } from "@/components/interfaces/home-page";
import { DigitalTimeCapsuleForm } from "@/components/interfaces/digital-time-capsule-form";
import { Header } from "@/components/ui/header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function CreateDigitalTimeCapsuleForm() {
    const router = useRouter()

    const handleGoBack = () => {
      router.back()
    }
    return (
    <>
    <Button 
          onClick={handleGoBack}
          variant="ghost" 
          className="inline-flex items-center text-black hover:text-gray-800 transition-colors duration-200 my-6 ml-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Go Back</span>
        </Button>

    <DigitalTimeCapsuleForm/>
    </>
  );
}
