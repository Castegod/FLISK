"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Espacio = {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  descripcion: string | null
}

export default function SpaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [espacio, setEspacio] = useState<Espacio | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/spaces/${params.id}`).then((r) => r.json()).then(setEspacio)
  }, [params.id])

  async function handleReserva(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        espacioId: Number(params.id),
        fecha: form.get("fecha"),
        horaInicio: form.get("horaInicio"),
        horaFin: form.get("horaFin"),
      }),
    })

    const json = await res.json()
    setLoading(false)

    if (res.ok) {
      toast({ title: "Reserva creada", description: "Tu reserva ha sido registrada" })
      router.push("/bookings")
    } else {
      toast({ title: "Error", description: json.error, variant: "destructive" })
    }
  }

  if (!espacio) return <div className="p-6">Cargando...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">← Volver</Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{espacio.nombre}</h1>
          <p className="text-muted-foreground mt-1">{espacio.descripcion}</p>
          <div className="flex gap-2 mt-2">
            <Badge>{espacio.tipo}</Badge>
            <Badge variant="outline">Capacidad: {espacio.capacidad}</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservar espacio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReserva} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horaInicio">Hora inicio</Label>
                <Input id="horaInicio" name="horaInicio" type="time" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horaFin">Hora fin</Label>
                <Input id="horaFin" name="horaFin" type="time" required />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Reservando..." : "Reservar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
