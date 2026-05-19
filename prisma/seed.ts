import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  const espacios = await prisma.espacio.createMany({
    data: [
      { nombre: "Cancha de Fútbol", tipo: "DEPORTIVO", capacidad: 22, descripcion: "Cancha sintética de fútbol 11" },
      { nombre: "Cancha de Baloncesto", tipo: "DEPORTIVO", capacidad: 10, descripcion: "Cancha cubierta de baloncesto" },
      { nombre: "Cancha de Voleibol", tipo: "DEPORTIVO", capacidad: 12, descripcion: "Cancha de voleibol playa" },
      { nombre: "Salón de Danza", tipo: "CULTURAL", capacidad: 20, descripcion: "Salón con espejos y barra" },
      { nombre: "Sala de Música", tipo: "CULTURAL", capacidad: 15, descripcion: "Sala con instrumentos musicales" },
      { nombre: "Auditorio", tipo: "SALA", capacidad: 100, descripcion: "Auditorio principal con proyector" },
      { nombre: "Sala de Estudio", tipo: "SALA", capacidad: 30, descripcion: "Sala silenciosa con mesas" },
    ],
  })

  const actividades = await prisma.actividad.createMany({
    data: [
      { nombre: "Torneo de Fútbol", descripcion: "Torneo inter-facultades", fecha: new Date("2026-06-15"), lugar: "Cancha de Fútbol", cupoMaximo: 40 },
      { nombre: "Clase de Yoga", descripcion: "Yoga al aire libre", fecha: new Date("2026-06-10"), lugar: "Salón de Danza", cupoMaximo: 20 },
      { nombre: "Concierto de Banda", descripcion: "Presentación de la banda universitaria", fecha: new Date("2026-06-20"), lugar: "Auditorio", cupoMaximo: 80 },
    ],
  })

  console.log("Seed completado. Espacios:", espacios.count, "Actividades:", actividades.count)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    const prisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) })
    await prisma.$disconnect()
  })
