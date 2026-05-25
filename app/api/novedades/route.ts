import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"

export async function GET() {
  const novedades = await prisma.novedad.findMany({
    orderBy: { createdAt: "desc" },
    include: { usuario: { select: { nombre: true, correo: true, tipo: true } } },
  })
  return NextResponse.json(novedades)
}

export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo: session.user.email } })
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  const { titulo, contenido } = await req.json()
  if (!titulo || !contenido) {
    return NextResponse.json({ error: "Título y contenido son requeridos" }, { status: 400 })
  }

  const novedad = await prisma.novedad.create({
    data: { titulo, contenido, usuarioId: usuario.id },
    include: { usuario: { select: { nombre: true, correo: true, tipo: true } } },
  })

  return NextResponse.json(novedad, { status: 201 })
}
