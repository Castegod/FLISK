"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type Usuario = {
  id: number
  nombre: string
  correo: string
  tipo: string
  estado: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsuarios)
  }, [])

  async function toggleEstado(usuario: Usuario) {
    const res = await fetch(`/api/users/${usuario.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: !usuario.estado }),
    })
    if (res.ok) {
      toast({ title: `Usuario ${usuario.estado ? "desactivado" : "activado"}` })
      setUsuarios((prev) => prev.map((u) => u.id === usuario.id ? { ...u, estado: !u.estado } : u))
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin - Usuarios</h1>

      <div className="space-y-3">
        {usuarios.map((usuario) => (
          <Card key={usuario.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{usuario.nombre}</h3>
                <p className="text-sm text-muted-foreground">{usuario.correo}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{usuario.tipo}</Badge>
                  <Badge variant={usuario.estado ? "default" : "destructive"}>
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => toggleEstado(usuario)}>
                {usuario.estado ? "Desactivar" : "Activar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
