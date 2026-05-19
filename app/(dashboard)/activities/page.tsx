"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Actividad = {
  id: number
  nombre: string
  descripcion: string | null
  fecha: string
  lugar: string
  cupoMaximo: number
}

export default function ActivitiesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/activities?activa=true").then((r) => r.json()).then(setActividades)
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Actividades</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actividades.map((act) => (
          <Card key={act.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/activities/${act.id}`)}>
            <CardHeader>
              <CardTitle className="text-lg">{act.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{act.descripcion}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline">{new Date(act.fecha).toLocaleDateString()}</Badge>
                <Badge variant="outline">{act.lugar}</Badge>
                <Badge variant="outline">Cupo: {act.cupoMaximo}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
