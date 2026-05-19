"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Actividad = {
  id: number
  nombre: string
  descripcion: string | null
  fecha: string
  lugar: string
  cupoMaximo: number
  inscripcionesCount: number
  cuposDisponibles: number
}

export default function ActivityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [actividad, setActividad] = useState<Actividad | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/activities/${params.id}`).then((r) => r.json()).then(setActividad)
  }, [params.id])

  async function inscribirse() {
    setLoading(true)
    const res = await fetch("/api/inscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actividadId: Number(params.id) }),
    })
    const json = await res.json()
    setLoading(false)

    if (res.ok) {
      toast({ title: "Inscripción exitosa" })
      setActividad((prev) => prev ? { ...prev, inscripcionesCount: prev.inscripcionesCount + 1, cuposDisponibles: prev.cuposDisponibles - 1 } : prev)
    } else {
      toast({ title: "Error", description: json.error, variant: "destructive" })
    }
  }

  if (!actividad) return <div className="p-6">Cargando...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">← Volver</Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{actividad.nombre}</h1>
          <p className="text-muted-foreground mt-1">{actividad.descripcion}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge>{new Date(actividad.fecha).toLocaleDateString()}</Badge>
            <Badge variant="secondary">{actividad.lugar}</Badge>
            <Badge variant={actividad.cuposDisponibles > 0 ? "default" : "destructive"}>
              {actividad.cuposDisponibles > 0 ? `${actividad.cuposDisponibles} cupos disponibles` : "LLENO"}
            </Badge>
          </div>
        </div>
        <Button onClick={inscribirse} disabled={loading || actividad.cuposDisponibles <= 0}>
          {loading ? "Inscribiendo..." : actividad.cuposDisponibles <= 0 ? "Sin cupo" : "Inscribirse"}
        </Button>
      </div>
    </div>
  )
}
