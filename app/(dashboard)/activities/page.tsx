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
    <div className="min-h-screen">
      <div className="bg-primary py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground mb-2 -ml-2">← Volver al inicio</Button>
          <h1 className="text-4xl font-bold text-primary-foreground">Actividades</h1>
          <p className="text-primary-foreground/80 text-lg mt-2">Inscríbete en actividades culturales y deportivas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6 pb-12">
        {actividades.length === 0 ? (
          <p className="text-muted-foreground mt-8">No hay actividades disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {actividades.map((act) => (
              <Card key={act.id} className="border-t-4 border-t-secondary shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex flex-col" onClick={() => router.push(`/activities/${act.id}`)}>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{act.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex flex-col flex-1">
                  <p className="text-sm text-muted-foreground mb-4">{act.descripcion}</p>
                  <div className="mt-auto flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">{new Date(act.fecha).toLocaleDateString()}</Badge>
                    <Badge variant="secondary">{act.lugar}</Badge>
                    <Badge variant="secondary">Cupo: {act.cupoMaximo}</Badge>
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
