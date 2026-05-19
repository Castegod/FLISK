"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type ReportData = {
  totalUsuarios: number
  totalReservas: number
  reservasPorEspacio: { nombre: string; cantidad: number }[]
  inscripcionesPorActividad: { nombre: string; cantidad: number }[]
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)

  useEffect(() => {
    fetch("/api/reports").then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <div className="p-6">Cargando...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader><CardTitle>Usuarios activos</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{data.totalUsuarios}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total reservas</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{data.totalReservas}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Reservas por espacio (30 días)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.reservasPorEspacio}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Inscripciones por actividad</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.inscripcionesPorActividad}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
