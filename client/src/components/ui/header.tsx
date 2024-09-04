import Link from "next/link";
import Image from "next/image";
import logoBlack from '@/assets/logo-black.png'
import logoWhite from '@/assets/logo-white.png'

export function Header({ black = false }) {
  const textColor = black ? "text-black" : "text-white";
  const hoverColor = black ? "hover:text-gray-700" : "hover:text-gray-300";
  const logoSrc = black ? logoBlack : logoWhite;

  return (
    <header className={`px-4 lg:px-6 h-14 flex items-center ${black ? 'bg-white' : 'bg-transparent'}`}>
      <Link className="flex items-center justify-center" href="/">
        <span className="sr-only">Digital Time Capsule</span>
        <Image
          src={logoSrc}
          alt="Digital Time Capsule Logo"
          width={50}
          height={50}
        />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link 
          className={`text-sm font-medium ${textColor} ${hoverColor} hover:underline underline-offset-4 transition-colors duration-200`} 
          href="/"
        >
          Home
        </Link>
        <Link 
          className={`text-sm font-medium ${textColor} ${hoverColor} hover:underline underline-offset-4 transition-colors duration-200`} 
          href="/about"
        >
          About
        </Link>
        <Link 
          className={`text-sm font-medium ${textColor} ${hoverColor} hover:underline underline-offset-4 transition-colors duration-200`} 
          href="/profile"
        >
          Profile
        </Link>
      </nav>
    </header>
  )
}