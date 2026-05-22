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
    <div className="min-h-screen">
      <div className="bg-primary py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Bienvenido, {session.user.name}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Gestiona tus espacios deportivos, actividades culturales y reservas
          </p>
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => signOut()}
              className="font-semibold"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-secondary shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Espacios</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">Reserva canchas, salones y auditorios</p>
              <Button className="w-full" onClick={() => router.push("/spaces")}>Ver espacios</Button>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-secondary shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Actividades</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">Inscríbete en actividades culturales y deportivas</p>
              <Button className="w-full" onClick={() => router.push("/activities")}>Ver actividades</Button>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-secondary shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Mis Reservas</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">Consulta y gestiona tus reservas</p>
              <Button className="w-full" onClick={() => router.push("/bookings")}>Ver reservas</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
