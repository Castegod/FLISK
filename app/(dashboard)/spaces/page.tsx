"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Espacio = {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  descripcion: string | null
}

export default function SpacesPage() {
  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [filtro, setFiltro] = useState("")
  const router = useRouter()

  useEffect(() => {
    const params = filtro ? `?tipo=${filtro}` : ""
    fetch(`/api/spaces${params}`).then((r) => r.json()).then(setEspacios)
  }, [filtro])

  const tipos = ["DEPORTIVO", "CULTURAL", "SALA"]

  return (
    <div className="min-h-screen">
      <div className="bg-primary py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground mb-2 -ml-2">← Volver al inicio</Button>
          <h1 className="text-4xl font-bold text-primary-foreground">Espacios</h1>
          <p className="text-primary-foreground/80 text-lg mt-2">Reserva canchas, salones y auditorios</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6 pb-12">
        <div className="flex gap-2 mb-6 mt-8">
          <Button variant={filtro === "" ? "default" : "outline"} onClick={() => setFiltro("")}>Todos</Button>
          {tipos.map((t) => (
            <Button key={t} variant={filtro === t ? "default" : "outline"} onClick={() => setFiltro(t)}>
              {t}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {espacios.map((espacio) => (
            <Card key={espacio.id} className="border-t-4 border-t-secondary shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex flex-col" onClick={() => router.push(`/spaces/${espacio.id}`)}>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{espacio.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col flex-1">
                <p className="text-sm text-muted-foreground mb-4">{espacio.descripcion}</p>
                <div className="mt-auto flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">{espacio.tipo}</Badge>
                  <Badge variant="secondary">Capacidad: {espacio.capacidad}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
