---
marp: true
theme: uncover
class: invert
paginate: true
---

<!-- _class: lead -->
# **FILSK**
## Bienestar Universitario UMNG
Plataforma de gestión de espacios deportivos, actividades culturales y reservas

---

# Problemática

**Antes**
- Procesos manuales y descentralizados
- Sin visibilidad de disponibilidad
- Conflictos de horarios
- Sin notificaciones automatizadas

**Ahora**
- Plataforma centralizada
- Disponibilidad en tiempo real
- Validación automática de conflictos
- Notificaciones por email

---

# Arquitectura

| Frontend | Backend | Base de Datos |
|----------|---------|---------------|
| Next.js 14 (App Router) | API Routes | PostgreSQL (Neon.tech) |
| TypeScript | Prisma 7 ORM | Migraciones |
| Tailwind CSS + shadcn/ui | NextAuth.js | Neon Serverless |
| TanStack Query | Zod validación | |

**Email:** Resend · **Gráficos:** Recharts · **Despliegue:** Render

---

# Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| 🏟️ **Espacios** | Reserva con filtro por tipo y validación de conflictos |
| 🎭 **Actividades** | Inscripción con control de cupo máximo |
| 📅 **Mis Reservas** | Gestión y cancelación con estados (PENDIENTE/CONFIRMADA/CANCELADA) |
| 📢 **Novedades** | Publicaciones de estudiantes y administradores |
| 📧 **Notificaciones** | Emails automáticos vía Resend |
| 👑 **Admin Panel** | CRUD completo + Reportes con gráficos |

---

# Flujo del Usuario

```
Registro/Login → Explorar → Reservar/Inscribirse → Gestionar
```

**Admin:** Panel Admin → Gestión de espacios, actividades, usuarios, reservas, reportes

---

# Tecnologías

`Next.js 14` `TypeScript` `Tailwind CSS` `shadcn/ui` `Prisma 7` `PostgreSQL` `Neon.tech` `NextAuth.js` `JWT` `Zod` `TanStack Query` `Resend` `Recharts` `Render`

| Métrica | Valor |
|---------|-------|
| Rutas | 31 |
| APIs REST | 14 |
| Componentes UI | 18 |

---

# Modelo de Datos

- **Usuario:** id, nombre, correo, tipo (ESTUDIANTE/ADMIN)
- **Espacio:** id, nombre, tipo (DEPORTIVO/CULTURAL/SALA), capacidad
- **Reserva:** id, fecha, horaInicio, horaFin, estado
- **Actividad:** id, nombre, fecha, lugar, cupoMaximo
- **Inscripcion:** id, usuario → actividad
- **Novedad:** id, titulo, contenido, usuario

---

<!-- _class: lead -->
# **¡Gracias!**

FILSK - Bienestar Universitario
Universidad Militar Nueva Granada

`#SomosUMNG` `#BienestarUniversitario` `#FILSK`
