"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
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
          <Image src="/logo.svg" alt="UMNG" width={60} height={70} className="h-20 w-auto mx-auto mb-4" />
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

      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-t-4 border-t-secondary shadow-lg flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Espacios</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-1">
              <p className="text-muted-foreground">Reserva canchas, salones y auditorios</p>
              <div className="mt-auto pt-6">
                <Button className="w-full" onClick={() => router.push("/spaces")}>Ver espacios</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-secondary shadow-lg flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Actividades</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-1">
              <p className="text-muted-foreground">Inscríbete en actividades culturales y deportivas</p>
              <div className="mt-auto pt-6">
                <Button className="w-full" onClick={() => router.push("/activities")}>Ver actividades</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-secondary shadow-lg flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Novedades</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-1">
              <p className="text-muted-foreground">Comparte y entérate de novedades</p>
              <div className="mt-auto pt-6">
                <Button className="w-full" onClick={() => router.push("/novedades")}>Ver novedades</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-secondary shadow-lg flex flex-col">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Mis Reservas</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col flex-1">
              <p className="text-muted-foreground">Consulta y gestiona tus reservas</p>
              <div className="mt-auto pt-6">
                <Button className="w-full" onClick={() => router.push("/bookings")}>Ver reservas</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
