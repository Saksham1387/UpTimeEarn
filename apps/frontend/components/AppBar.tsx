import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Activity } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export const AppBar = () => {
  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-emerald-400" />
          <span className="text-2xl font-bold">UpTimeEarn</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="hover:text-emerald-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-emerald-400 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="hover:text-emerald-400 transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center space-x-4">

            <ModeToggle/>
          <SignedOut>
            <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};
