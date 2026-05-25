"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle } from "lucide-react"

export default function ContactButton() {
  const [open, setOpen] = useState(false)
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asunto, mensaje }),
    })

    if (res.ok) {
      toast({ title: "Mensaje enviado", description: "Nos pondremos en contacto contigo pronto" })
      setAsunto("")
      setMensaje("")
      setOpen(false)
    } else {
      toast({ title: "Error", description: "No se pudo enviar el mensaje", variant: "destructive" })
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full p-4 shadow-xl hover:shadow-2xl transition-all z-50 group">
          <MessageCircle className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Contactar
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contactar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asunto">Asunto</Label>
            <Input id="asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} placeholder="¿Sobre qué necesitas ayuda?" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mensaje">Mensaje</Label>
            <Textarea id="mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe tu mensaje..." rows={4} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
