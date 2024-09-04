import Link from "next/link";

export function Header({ black = false }) {
  const textColor = black ? "text-black" : "text-white";
  const hoverColor = black ? "hover:text-gray-700" : "hover:text-gray-300";

  return (
    <header className={`px-4 lg:px-6 h-14 flex items-center ${black ? 'bg-white' : 'bg-transparent'}`}>
      <Link className="flex items-center justify-center" href="/">
        <span className="sr-only">Digital Time Capsule</span>
        <svg
          className={`h-6 w-6 ${textColor}`}
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect height="18" rx="2" width="18" x="3" y="3" />
          <path d="M21 9H3" />
          <path d="M9 21V9" />
        </svg>
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