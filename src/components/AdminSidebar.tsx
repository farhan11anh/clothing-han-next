"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "@/store"
import { logout } from "@/store/authSlice"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSidebar } from "@/contexts/SidebarContext"
import {
  LayoutDashboard,
  Package,
  Menu,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import DarkModeToggle from "./DarkModeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Produk", href: "/admin/products", icon: Package },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { collapsed, toggle } = useSidebar()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user || user.role !== "admin") return null

  return (
    <aside
      className={cn(
        "h-screen bg-white dark:bg-zinc-900 border-r flex flex-col justify-between transition-all duration-300 fixed z-20",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          {!collapsed && (
            <div className="text-xl font-bold text-primary">🛒 Toko</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="transition-transform"
          >
            <Menu
              className={cn("transform transition-transform", {
                "rotate-180": collapsed,
              })}
            />
          </Button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition-all",
                  isActive && "bg-muted font-semibold text-primary"
                )}
              >
                <Icon size={18} />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-auto rounded-full">
              <Avatar>
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <div className="font-medium">{user.username}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!collapsed && (
          <div className="ml-auto">
            <DarkModeToggle />
          </div>
        )}
      </div>
    </aside>
  )
}