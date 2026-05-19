"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  const router = useRouter()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => router.push("/admin/spaces")}>
          <CardHeader><CardTitle>Espacios</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Gestionar espacios deportivos y culturales</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => router.push("/admin/activities")}>
          <CardHeader><CardTitle>Actividades</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Gestionar actividades</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => router.push("/admin/bookings")}>
          <CardHeader><CardTitle>Reservas</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Gestionar reservas</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => router.push("/admin/users")}>
          <CardHeader><CardTitle>Usuarios</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Administrar usuarios</p></CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg" onClick={() => router.push("/admin/reports")}>
          <CardHeader><CardTitle>Reportes</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Ver estadísticas y gráficas</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
