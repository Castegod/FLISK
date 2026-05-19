"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-muted-foreground">No tienes reservas activas</p>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <Card key={reserva.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold">{reserva.espacio.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(reserva.fecha).toLocaleDateString()} · {reserva.horaInicio} - {reserva.horaFin}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={badgeVariant[reserva.estado] || "secondary"}>{reserva.estado}</Badge>
                  {reserva.estado !== "CANCELADA" && (
                    <Button variant="outline" size="sm" onClick={() => cancelar(reserva.id)}>Cancelar</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
