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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Espacios</h1>

      <div className="flex gap-2 mb-6">
        <Button variant={filtro === "" ? "default" : "outline"} onClick={() => setFiltro("")}>Todos</Button>
        {tipos.map((t) => (
          <Button key={t} variant={filtro === t ? "default" : "outline"} onClick={() => setFiltro(t)}>
            {t}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {espacios.map((espacio) => (
          <Card key={espacio.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/spaces/${espacio.id}`)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{espacio.nombre}</CardTitle>
                <Badge>{espacio.tipo}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{espacio.descripcion}</p>
              <p className="text-sm">Capacidad: {espacio.capacidad} personas</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
