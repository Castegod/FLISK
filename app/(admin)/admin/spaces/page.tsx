"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

type Espacio = {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  descripcion: string | null
  activo: boolean
}

export default function AdminSpacesPage() {
  const [espacios, setEspacios] = useState<Espacio[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Espacio | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/spaces").then((r) => r.json()).then(setEspacios)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      nombre: form.get("nombre"),
      tipo: form.get("tipo"),
      capacidad: Number(form.get("capacidad")),
      descripcion: form.get("descripcion"),
    }

    const url = editing ? `/api/spaces/${editing.id}` : "/api/spaces"
    const method = editing ? "PUT" : "POST"

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    const json = await res.json()

    if (res.ok) {
      toast({ title: editing ? "Espacio actualizado" : "Espacio creado" })
      setOpen(false)
      setEditing(null)
      fetch("/api/spaces").then((r) => r.json()).then(setEspacios)
    } else {
      toast({ title: "Error", description: json.error, variant: "destructive" })
    }
  }

  async function desactivar(id: number) {
    const res = await fetch(`/api/spaces/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast({ title: "Espacio desactivado" })
      fetch("/api/spaces").then((r) => r.json()).then(setEspacios)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin - Espacios</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>Nuevo espacio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar espacio" : "Nuevo espacio"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={editing?.nombre} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select name="tipo" defaultValue={editing?.tipo || "DEPORTIVO"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEPORTIVO">Deportivo</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="SALA">Sala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacidad">Capacidad</Label>
                <Input id="capacidad" name="capacidad" type="number" defaultValue={editing?.capacidad} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input id="descripcion" name="descripcion" defaultValue={editing?.descripcion || ""} />
              </div>
              <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {espacios.filter((e) => e.activo).map((espacio) => (
          <Card key={espacio.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{espacio.nombre}</h3>
                <p className="text-sm text-muted-foreground">{espacio.tipo} - {espacio.capacidad} personas</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(espacio); setOpen(true) }}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => desactivar(espacio.id)}>Desactivar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
