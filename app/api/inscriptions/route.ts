import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendInscriptionConfirmation } from "@/lib/email"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { actividadId } = await req.json()

    const actividad = await prisma.actividad.findUnique({
      where: { id: actividadId },
      include: { _count: { select: { inscripciones: true } } },
    })

    if (!actividad || !actividad.activa) {
      return NextResponse.json({ error: "Actividad no disponible" }, { status: 404 })
    }

    if (actividad._count.inscripciones >= actividad.cupoMaximo) {
      return NextResponse.json({ error: "La actividad está llena" }, { status: 409 })
    }

    const existente = await prisma.inscripcion.findFirst({
      where: { usuarioId: Number(session.user.id), actividadId },
    })

    if (existente) {
      return NextResponse.json({ error: "Ya estás inscrito en esta actividad" }, { status: 409 })
    }

    const inscripcion = await prisma.inscripcion.create({
      data: {
        usuarioId: Number(session.user.id),
        actividadId,
      },
    })

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(session.user.id) } })
    if (usuario) {
      sendInscriptionConfirmation(
        usuario.correo,
        usuario.nombre,
        actividad.nombre,
        actividad.fecha.toLocaleDateString(),
        actividad.lugar
      ).catch(() => {})
    }

    return NextResponse.json(inscripcion, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al inscribirse" }, { status: 500 })
  }
}
