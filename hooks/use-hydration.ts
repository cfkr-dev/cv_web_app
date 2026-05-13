"use client"

import { useEffect, useState } from "react"

type UseHydrationParams<T> = {
  load: () => Promise<T>
  errorMessage: string
}

export function useHydration<T>({
  load,
  errorMessage,
}: UseHydrationParams<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function hydrate() {
      try {
        const result = await load()

        if (!isMounted) {
          return
        }

        setData(result)
      } catch (error) {
        console.error(errorMessage, error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void hydrate()

    return () => {
      isMounted = false
    }
  }, [errorMessage, load])

  return {
    data,
    isLoading,
  }
}
