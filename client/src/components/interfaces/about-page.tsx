'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock, Lock, Shield, Sparkles } from "lucide-react"
import { Header } from "../ui/header"

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white">
        <Header/>

      <div className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Digital Time Capsule</h1>
          <p className="text-xl text-gray-300">Preserve your memories for the future, securely and creatively.</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">What is a Digital Time Capsule?</h2>
          <p className="text-lg mb-4 text-gray-300">
            A Digital Time Capsule is a secure, blockchain-based platform that allows you to store digital content
            and reveal it at a predetermined time in the future. It's like burying a traditional time capsule, but
            with the added security and flexibility of digital technology.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-800 p-6 rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-300">Your content is encrypted and stored on a decentralized blockchain, ensuring its integrity and security.</p>
            </div>
            <div className="bg-indigo-800 p-6 rounded-lg shadow-md">
              <Lock className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Time-Locked Content</h3>
              <p className="text-gray-300">Set a future date for your content to be revealed. It remains securely locked until then.</p>
            </div>
            <div className="bg-indigo-800 p-6 rounded-lg shadow-md">
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">NFT Integration</h3>
              <p className="text-gray-300">Your time capsule can be minted as a unique NFT, adding value and authenticity to your digital memories.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Benefits</h2>
          <ul className="list-disc list-inside text-lg space-y-2 text-gray-300">
            <li>Preserve memories in a secure, tamper-proof environment</li>
            <li>Share your past with future generations</li>
            <li>Create unique, time-locked digital assets</li>
            <li>Contribute to a decentralized historical record</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-indigo-800 rounded-lg shadow-md">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg px-4">How secure is my content?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                Your content is encrypted and stored on a decentralized blockchain, making it extremely secure and
                tamper-proof. Only you and your designated recipients can access the content when it's unlocked.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg px-4">Can I change the unlock date after creating a time capsule?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                Once a time capsule is created and stored on the blockchain, the unlock date cannot be changed. This
                ensures the integrity of the time-locking feature.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg px-4">What types of content can I store in a Digital Time Capsule?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                You can store various types of digital content, including text, images, videos, and audio files. The
                platform supports most common file formats.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg px-4">How does the NFT integration work?</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-300">
                When you create a Digital Time Capsule, you have the option to mint it as a unique NFT. This NFT
                represents ownership of the time capsule and can be traded or transferred like other NFTs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <footer className="bg-purple-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">&copy; 2024 Digital Time Capsule. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}