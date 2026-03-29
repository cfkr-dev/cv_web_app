import { SearchX } from "lucide-react"

import { StatusPage } from "@/components/status-page"

export default function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      eyebrow="Recurso no encontrado"
      title="La pagina que buscas no existe o ya no esta disponible."
      description="La URL puede ser incorrecta, el contenido haberse movido o el enlace estar desactualizado."
      icon={SearchX}
      highlights={[
        "Revisa la direccion escrita en el navegador por si contiene errores.",
        "Puedes volver al inicio o usar el acceso principal de la plataforma.",
        "Si llegaste desde un enlace interno, conviene corregir esa navegacion.",
      ]}
      actions={[
        { href: "/", label: "Volver al inicio" },
        { href: "/login", label: "Ir al login", variant: "secondary" },
        { href: "/contact", label: "Contactar", variant: "outline" },
      ]}
    />
  )
}
