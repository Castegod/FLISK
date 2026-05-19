"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  if (!session) return null

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bienvenido, {session.user.name}</h1>
        <Button variant="outline" onClick={() => signOut()}>Cerrar Sesión</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Espacios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Reserva canchas, salones y auditorios</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/spaces")}>Ver espacios</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Inscríbete en actividades culturales y deportivas</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/activities")}>Ver actividades</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Consulta y gestiona tus reservas</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/bookings")}>Ver reservas</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
