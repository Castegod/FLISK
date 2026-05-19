import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const [totalUsuarios, totalReservas, reservasPorEspacio, inscripcionesPorActividad] = await Promise.all([
      prisma.usuario.count({ where: { estado: true } }),
      prisma.reserva.count(),
      prisma.reserva.groupBy({
        by: ["espacioId"],
        _count: { id: true },
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.inscripcion.groupBy({
        by: ["actividadId"],
        _count: { id: true },
      }),
    ])

    const espacios = await prisma.espacio.findMany({ select: { id: true, nombre: true } })
    const actividades = await prisma.actividad.findMany({ select: { id: true, nombre: true } })

    const espaciosMap = Object.fromEntries(espacios.map((e) => [e.id, e.nombre]))
    const actividadesMap = Object.fromEntries(actividades.map((a) => [a.id, a.nombre]))

    return NextResponse.json({
      totalUsuarios,
      totalReservas,
      reservasPorEspacio: reservasPorEspacio.map((r) => ({
        nombre: espaciosMap[r.espacioId] || "Desconocido",
        cantidad: r._count.id,
      })),
      inscripcionesPorActividad: inscripcionesPorActividad.map((i) => ({
        nombre: actividadesMap[i.actividadId] || "Desconocido",
        cantidad: i._count.id,
      })),
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener reportes" }, { status: 500 })
  }
}
