"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

type Novedad = {
  id: number
  titulo: string
  contenido: string
  createdAt: string
  usuario: { nombre: string; correo: string; tipo: string }
}

export default function NovedadesPage() {
  const [novedades, setNovedades] = useState<Novedad[]>([])
  const [open, setOpen] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    fetch("/api/novedades").then((r) => r.json()).then(setNovedades)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/novedades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, contenido }),
    })

    if (res.ok) {
      const novedad = await res.json()
      setNovedades((prev) => [novedad, ...prev])
      setTitulo("")
      setContenido("")
      setOpen(false)
      toast({ title: "Novedad publicada" })
    } else {
      const json = await res.json()
      toast({ title: "Error", description: json.error, variant: "destructive" })
    }

    setLoading(false)
  }

  async function eliminar(id: number) {
    const res = await fetch(`/api/novedades/${id}`, { method: "DELETE" })
    if (res.ok) {
      setNovedades((prev) => prev.filter((n) => n.id !== id))
      toast({ title: "Novedad eliminada" })
    }
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-primary-foreground/70 hover:text-primary-foreground mb-2 -ml-2">← Volver al inicio</Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground">Novedades</h1>
              <p className="text-primary-foreground/80 text-lg mt-2">Comparte y entérate de las últimas novedades</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="font-semibold">Nueva novedad</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Publicar novedad</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título de la novedad" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contenido">Contenido</Label>
                    <Textarea id="contenido" value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder="Escribe tu novedad..." rows={4} required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Publicando..." : "Publicar"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6 pb-12">
        {novedades.length === 0 ? (
          <p className="text-muted-foreground mt-8">No hay novedades aún. ¡Sé el primero en publicar!</p>
        ) : (
          <div className="space-y-4 mt-8">
            {novedades.map((novedad) => (
              <Card key={novedad.id} className="border-t-4 border-t-secondary shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{novedad.titulo}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{novedad.usuario.nombre}</Badge>
                        <Badge variant="outline">{novedad.usuario.tipo}</Badge>
                        <span className="text-xs text-muted-foreground self-center">
                          {new Date(novedad.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {(session?.user?.email && (novedad.usuario.correo === session.user.email)) && (
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => eliminar(novedad.id)}>Eliminar</Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{novedad.contenido}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
