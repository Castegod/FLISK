"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session.user.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") return <div className="p-6">Cargando...</div>
  if (session?.user.role !== "ADMIN") return null

  return <div className="min-h-screen bg-background">{children}</div>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Image src="/logo.svg" alt="UMNG" width={28} height={32} className="h-8 w-auto" />
          <h1 className="text-lg font-bold text-primary-foreground">FILSK - Administración</h1>
        </div>
      </div>
      <AdminGuard>{children}</AdminGuard>
    </div>
  )
}
