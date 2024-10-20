"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Menu, Home, HelpCircle, Settings, Sun, Moon , Scroll} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const path = usePathname();


  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Questions", href: "/questions", icon: HelpCircle },
    { name: "Upgrade", href: "/upgrade", icon: Settings },
    { name: "How it works", href: "/docs", icon: Scroll},
  ];

  return (
    <nav className={`border-b ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-900'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <lord-icon
              src="https://cdn.lordicon.com/vycwlttg.json"
              trigger="hover"
              stroke="bold"
              colors="primary:#8930e8,secondary:#8930e8"
              style={{ width: 50, height: 50 }}
            ></lord-icon>
            <span className="text-2xl font-[900] text-[#8930e8]">Veri<span className="text-3xl">Q</span>uest</span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className={`text-muted-foreground hover:text-[#8930e8] ${darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-300'}`}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 hover:font-bold transition-all hover:text-[#8930e8]"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8",
                },
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={`w-[300px] sm:w-[400px] ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      asChild
                      className="justify-start"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center space-x-2"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;