"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getCartCount } from "@/utils/cartUtils";
import { useSelector } from "react-redux";
import AuthModal from "./Auth/AuthModal";
import UserMenu from "./Auth/UserMenu";

import Logo from "../assets/Logo.svg";

export default function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth) || {};

  useEffect(() => {
    setMounted(true);
    setCartCount(getCartCount());

    // Add event listener for cart updates
    window.addEventListener("cartUpdated", () => {
      setCartCount(getCartCount());
    });

    return () => {
      window.removeEventListener("cartUpdated", () => {
        setCartCount(getCartCount());
      });
    };
  }, []);

  const handleLoginClick = () => {
    setAuthType("login");
    setIsAuthModalOpen(true);
  };

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About us" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-transparent font-questrial">
        <div className="max-w-[1199px] mx-auto px-[10px] h-[100px] py-4">
          <div className="flex items-center justify-between">
            {/* Logo section */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="Fresh Harvests"
                width={40}
                height={40}
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group"
                >
                  <span className="font-questrial text-[14px] leading-[24px] tracking-[-0.02em] text-[#4A4A52]">
                    {link.label}
                  </span>
                  <span
                    className={`absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-[14px] h-[3px] bg-[#749B3F] rounded-[10px] transition-opacity duration-200 ${
                      (link.href === "/" && pathname === "/") ||
                      (link.href !== "/" && pathname.startsWith(link.href))
                        ? "opacity-100"
                        : "opacity-0"
                    } group-hover:opacity-100`}
                  />
                </Link>
              ))}
            </nav>

            {/* Actions section */}
            <div className="flex items-center justify-between space-x-4">
              <Link
                href="/favorites"
                className="hidden md:flex text-[#749B3F] border-white fill-[#749B3F] hover:text-primaryColor items-center space-x-2"
              >
                <Heart className="w-6 h-6 fill-current" />
                <span className="text-[14px] leading-[24px] tracking-[-0.02em] text-[#212337]">
                  Favorites
                </span>
              </Link>

              <Link
                href="/cart"
                className="relative text-primaryColor fill-[#749B3F] hover:text-[#749B3F] flex items-center space-x-2"
              >
                {cartCount > 0 && (
                  <div className="absolute flex items-center justify-center right-[-8px] md:left-[50%] top-[-8px] transform md:-translate-x-1/2 w-[20px] h-[20px] bg-[#EE4536] border-2 border-[#EDEDED] rounded-full">
                    <span className="text-white text-xs">{cartCount}</span>
                  </div>
                )}
                <FaShoppingCart className="w-6 h-6 fill-current" />
                <span className="text-[14px] hidden md:flex leading-[24px]  tracking-[-0.02em] text-textPrimaryColor">
                  Cart
                </span>
              </Link>

              {user ? (
                <UserMenu />
              ) : (
                <div className="flex">
                  <button
                    onClick={handleLoginClick}
                    className="hidden md:flex items-center px-[24px] py-[12px] h-[41px] border border-gray-300 hover:border-black rounded-[4px] hover:bg-gray-50"
                  >
                    <span className="font-rubik font-semibold text-textPrimaryColor">
                      Sign in
                    </span>
                  </button>
                </div>
              )}

              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-[#749B3F] bg-white" />
                ) : (
                  <Menu className="h-6 w-6 text-[#749B3F]  bg-white" />
                )}
              </button>
            </div>

            {/* <div className='flex items-center justify-between space-x-4'>
              <Link
                href='/favorites'
                className='hidden md:flex text-white border-white fill-[#749B3F] hover:text-primaryColor items-center space-x-2'
              >
                <Heart className='w-6 h-6 fill-current' />
                <span className='text-[14px] leading-[24px] tracking-[-0.02em] text-white'>
                  Favorites
                </span>
              </Link>

              <Link
                href='/cart'
                className='relative text-white fill-[#749B3F] hover:hover:text-primaryColor flex items-center space-x-2'
              >
                {cartCount > 0 && (
                  <div className='absolute flex items-center justify-center right-[-8px] md:left-[50%] top-[-8px] transform md:-translate-x-1/2 w-[20px] h-[20px] bg-[#EE4536] border-2 border-[#EDEDED] rounded-full'>
                    <span className='text-white text-xs'>{cartCount}</span>
                  </div>
                )}
                <FaShoppingCart className='w-6 h-6 fill-current' />
                <span className='text-[14px] hidden md:flex leading-[24px]  tracking-[-0.02em] text-white'>
                  Cart
                </span>
              </Link>

             
              {user ? (
                <UserMenu />
              ) : (
                <div className='flex'>
                  <button
                    onClick={handleLoginClick}
                    className='hidden md:flex items-center px-[24px] py-[12px] h-[41px] border border-gray-300 hover:border-black rounded-[4px] hover:bg-gray-50'
                  >
                    <span className='font-rubik font-semibold text-white'>
                      Sign in
                    </span>
                  </button>
                </div>
              )}

              
              <button
                className='md:hidden'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className='h-6 w-6 text-white' />
                ) : (
                  <Menu className='h-6 w-6 text-white' />
                )}
              </button>
            </div> */}
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white shadow-lg">
              <div className="flex flex-col p-4">
                {menuItems.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-2 px-4 text-[#4A4A52] hover:bg-gray-100"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/favorites"
                  className="py-2 px-4 text-[#4A4A52] hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5 text-[#749B3F]" />
                  <span>Favorites</span>
                </Link>
                <Link
                  href="/cart"
                  className="py-2 px-4 text-[#4A4A52] hover:bg-gray-100 flex items-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5 text-[#749B3F]" />
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-[#EE4536] text-white text-xs px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Sign In button moved here */}
                {user ? (
                  ""
                ) : (
                  <button
                    onClick={handleLoginClick}
                    className="flex items-center justify-center text-center px-[24px] py-[12px] h-[41px] border border-gray-300 hover:border-black rounded-[4px] hover:bg-gray-50"
                  >
                    <span className="font-rubik text-center font-semibold">
                      Sign in
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
      />
    </>
  );
}
