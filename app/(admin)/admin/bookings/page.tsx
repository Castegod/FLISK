"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type Reserva = {
  id: number
  fecha: string
  horaInicio: string
  horaFin: string
  estado: string
  usuario: { nombre: string; correo: string }
  espacio: { nombre: string }
}

export default function AdminBookingsPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/bookings?all=true").then((r) => r.json()).then(setReservas)
  }, [])

  async function actualizarEstado(id: number, estado: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })
    if (res.ok) {
      toast({ title: `Reserva ${estado.toLowerCase()}` })
      fetch("/api/bookings?all=true").then((r) => r.json()).then(setReservas)
    }
  }

  const badgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
    CONFIRMADA: "default",
    PENDIENTE: "secondary",
    CANCELADA: "destructive",
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin - Reservas</h1>

      <div className="space-y-4">
        {reservas.map((reserva) => (
          <Card key={reserva.id} className="border-t-4 border-t-secondary">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{reserva.espacio.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(reserva.fecha).toLocaleDateString()} · {reserva.horaInicio} - {reserva.horaFin}
                </p>
                <p className="text-xs text-muted-foreground">{reserva.usuario.nombre} ({reserva.usuario.correo})</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={badgeVariant[reserva.estado] || "secondary"}>{reserva.estado}</Badge>
                {reserva.estado === "PENDIENTE" && (
                  <>
                    <Button size="sm" onClick={() => actualizarEstado(reserva.id, "CONFIRMADA")}>Aprobar</Button>
                    <Button size="sm" variant="destructive" onClick={() => actualizarEstado(reserva.id, "CANCELADA")}>Rechazar</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
