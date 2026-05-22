"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Reserva = {
  id: number
  fecha: string
  horaInicio: string
  horaFin: string
  estado: string
  espacio: { nombre: string; tipo: string }
}

export default function BookingsPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setReservas)
  }, [])

  async function cancelar(id: number) {
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast({ title: "Reserva cancelada" })
      setReservas((prev) => prev.filter((r) => r.id !== id))
    }
  }

  const badgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
    CONFIRMADA: "default",
    PENDIENTE: "secondary",
    CANCELADA: "destructive",
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground mb-2 -ml-2">← Volver al inicio</Button>
          <h1 className="text-4xl font-bold text-primary-foreground">Mis Reservas</h1>
          <p className="text-primary-foreground/80 text-lg mt-2">Consulta y gestiona tus reservas</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6 pb-12">
        {reservas.length === 0 ? (
          <p className="text-muted-foreground mt-8">No tienes reservas activas</p>
        ) : (
          <div className="space-y-4 mt-8">
            {reservas.map((reserva) => (
              <Card key={reserva.id} className="border-t-4 border-t-secondary shadow-lg">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-lg">{reserva.espacio.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reserva.fecha).toLocaleDateString()} · {reserva.horaInicio} - {reserva.horaFin}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={badgeVariant[reserva.estado] || "secondary"}>{reserva.estado}</Badge>
                    {reserva.estado !== "CANCELADA" && (
                      <Button variant="destructive" size="sm" onClick={() => cancelar(reserva.id)}>Cancelar</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
