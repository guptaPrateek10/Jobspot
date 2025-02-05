import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { buttonVariants } from "../ui/button";
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Job Marshal Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job<span className="text-primary">Marshal</span>
        </h1>
      </Link>

      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
          Post Job
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
