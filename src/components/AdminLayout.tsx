"use client"

import AdminSidebar from "./AdminSidebar"
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext"

function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <main
      className={`transition-all duration-300 w-full ${
        collapsed ? "ml-20" : "ml-64"
      } p-6`}
    >
      {children}
    </main>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <AdminSidebar />
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </SidebarProvider>
  )
}
