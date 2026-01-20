import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Logo
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/tracks"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              tracks
            </Link>
            <Link
              href="/events"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              events
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="search"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Login + SignUp */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Login + SignUp
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}