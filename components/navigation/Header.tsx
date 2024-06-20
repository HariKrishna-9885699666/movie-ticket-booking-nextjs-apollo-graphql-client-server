"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname(); // Get the current route
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <img
            src="https://i.imgur.com/ai5lXCM.png"
            alt="Logo"
            className="w-auto"
            style={{ width: "120px", height: "80px" }}
          />
        </Link>
        <ul className="flex space-x-4 text-center">
          <li>
            <Link
              href="/"
              className={`hover:text-gray-800 ${
                pathname === "/" ? "text-blue-500" : ""
              }`}
            >
              Home{" "}
            </Link>
          </li>
          <li>
            <Link
              href="/movies"
              className={`hover:text-gray-800 ${
                pathname.startsWith("/movies") ? "text-blue-500" : ""
              }`}
            >
              Movies{" "}
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className={`hover:text-gray-800 ${
                pathname === "/services" ? "text-blue-500" : ""
              }`}
            >
              Services{" "}
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={`hover:text-gray-800 ${
                pathname === "/contact" ? "text-blue-500" : ""
              }`}
            >
              Contact{" "}
            </Link>
          </li>
        </ul>
        <div className="flex space-x-2">
          <Link href="/login" legacyBehavior>
            <a className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
              Login
            </a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Sign Up
            </a>
          </Link>
        </div>
      </nav>
    </header>
  );
}
