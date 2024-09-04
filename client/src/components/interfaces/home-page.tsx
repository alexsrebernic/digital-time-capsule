'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GithubIcon, TwitterIcon, FacebookIcon } from "lucide-react"
import { Header } from "../ui/header"

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900">
      <Header/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Preserve Your Digital Legacy
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Create a time capsule of your digital memories. Share your story with future generations.
                </p>
              </div>
              <div className="space-x-4">
                 <Link href="/create">
                  <Button className="bg-purple-600 text-white hover:bg-purple-700">Create Capsule</Button>
                </Link>
                <Link href="/mycapsules">
                  <Button variant="outline" className="text-purple-600 border-white hover:bg-white hover:text-purple-900">
                    My Capsules
                  </Button>
                </Link>

              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-purple-300">
        <p className="text-xs text-gray-300">© 2024 Digital Time Capsule. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-300" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-300" href="#">
            Privacy
          </Link>
        </nav>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="#" className="text-gray-300 hover:text-white">
            <TwitterIcon className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <FacebookIcon className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            <GithubIcon className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}