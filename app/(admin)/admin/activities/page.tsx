"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

type Actividad = {
  id: number
  nombre: string
  descripcion: string | null
  fecha: string
  lugar: string
  cupoMaximo: number
  activa: boolean
}

export default function AdminActivitiesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Actividad | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/activities").then((r) => r.json()).then(setActividades)
  }, [])

  function formatDateForInput(iso: string) {
    return new Date(iso).toISOString().slice(0, 16)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = {
      nombre: form.get("nombre"),
      descripcion: form.get("descripcion"),
      fecha: new Date(form.get("fecha") as string).toISOString(),
      lugar: form.get("lugar"),
      cupoMaximo: Number(form.get("cupoMaximo")),
    }

    const url = editing ? `/api/activities/${editing.id}` : "/api/activities"
    const method = editing ? "PUT" : "POST"

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    const json = await res.json()

    if (res.ok) {
      toast({ title: editing ? "Actividad actualizada" : "Actividad creada" })
      setOpen(false)
      setEditing(null)
      fetch("/api/activities").then((r) => r.json()).then(setActividades)
    } else {
      toast({ title: "Error", description: json.error, variant: "destructive" })
    }
  }

  async function desactivar(id: number) {
    await fetch(`/api/activities/${id}`, { method: "DELETE" })
    toast({ title: "Actividad desactivada" })
    fetch("/api/activities").then((r) => r.json()).then(setActividades)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin - Actividades</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>Nueva actividad</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar actividad" : "Nueva actividad"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" defaultValue={editing?.nombre} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Input id="descripcion" name="descripcion" defaultValue={editing?.descripcion || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha y hora</Label>
                <Input id="fecha" name="fecha" type="datetime-local" defaultValue={editing ? formatDateForInput(editing.fecha) : ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lugar">Lugar</Label>
                <Input id="lugar" name="lugar" defaultValue={editing?.lugar} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cupoMaximo">Cupo máximo</Label>
                <Input id="cupoMaximo" name="cupoMaximo" type="number" defaultValue={editing?.cupoMaximo} required />
              </div>
              <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {actividades.filter((a) => a.activa).map((act) => (
          <Card key={act.id} className="border-t-4 border-t-secondary">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{act.nombre}</h3>
                <p className="text-sm text-muted-foreground">{new Date(act.fecha).toLocaleDateString()} · {act.lugar} · Cupo: {act.cupoMaximo}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(act); setOpen(true) }}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => desactivar(act.id)}>Desactivar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
