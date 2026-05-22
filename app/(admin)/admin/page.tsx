"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const router = useRouter()

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg border-t-4 border-t-secondary transition-shadow" onClick={() => router.push("/admin/spaces")}>
          <CardHeader className="text-center"><CardTitle className="text-2xl">Espacios</CardTitle></CardHeader>
          <CardContent className="text-center"><p className="text-muted-foreground">Gestionar espacios deportivos y culturales</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg border-t-4 border-t-secondary transition-shadow" onClick={() => router.push("/admin/activities")}>
          <CardHeader className="text-center"><CardTitle className="text-2xl">Actividades</CardTitle></CardHeader>
          <CardContent className="text-center"><p className="text-muted-foreground">Gestionar actividades</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg border-t-4 border-t-secondary transition-shadow" onClick={() => router.push("/admin/bookings")}>
          <CardHeader className="text-center"><CardTitle className="text-2xl">Reservas</CardTitle></CardHeader>
          <CardContent className="text-center"><p className="text-muted-foreground">Gestionar reservas</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg border-t-4 border-t-secondary transition-shadow" onClick={() => router.push("/admin/users")}>
          <CardHeader className="text-center"><CardTitle className="text-2xl">Usuarios</CardTitle></CardHeader>
          <CardContent className="text-center"><p className="text-muted-foreground">Administrar usuarios</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg border-t-4 border-t-secondary transition-shadow" onClick={() => router.push("/admin/reports")}>
          <CardHeader className="text-center"><CardTitle className="text-2xl">Reportes</CardTitle></CardHeader>
          <CardContent className="text-center"><p className="text-muted-foreground">Ver estadísticas y gráficas</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
