"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (!isLoading && user && !allowedRoles.includes(user.role)) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })

      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "student":
          router.push("/student")
          break
        case "teacher":
          router.push("/teacher")
          break
        case "hod":
          router.push("/hod")
          break
        case "principal":
          router.push("/principal")
          break
        default:
          router.push("/login")
      }
    }
  }, [user, isLoading, router, allowedRoles, toast])

  // Show nothing while checking authentication
  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}

