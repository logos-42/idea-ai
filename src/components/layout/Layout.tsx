
import React from "react";
import { NavBar } from "@/components/ui/NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar />
      <main className="flex-1 overflow-hidden animate-fade-in">
        <div className="h-full overflow-y-auto p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
