"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, Menu, User, FileText, Home, UserCog, Users } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const getRoleIcon = () => {
    switch (user.role) {
      case "student":
        return <BookOpen className="h-5 w-5" />
      case "teacher":
        return <Users className="h-5 w-5" />
      case "hod":
        return <UserCog className="h-5 w-5" />
      case "principal":
        return <User className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getDashboardLink = () => {
    switch (user.role) {
      case "student":
        return "/student"
      case "teacher":
        return "/teacher"
      case "hod":
        return "/hod"
      case "principal":
        return "/principal"
      default:
        return "/"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-4 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:max-w-sm">
              <nav className="flex flex-col gap-4 pt-4">
                <Button variant="ghost" className="justify-start" onClick={() => router.push(getDashboardLink())}>
                  <Home className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => logout()}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <span className="text-lg font-semibold">Complaint Box</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {getRoleIcon()}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <Button variant="ghost" className="justify-start" onClick={() => router.push(getDashboardLink())}>
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => logout()}>
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

