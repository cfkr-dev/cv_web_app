import { notFound } from "next/navigation"
import { DevToastsDemo } from "./toasts-demo"

const isDevelopmentApp =
  process.env.NEXT_PUBLIC_APP_ENV === "development" ||
  process.env.NODE_ENV === "development"

export default function DevToastsPage() {
  if (!isDevelopmentApp) {
    notFound()
  }

  return <DevToastsDemo />
}
