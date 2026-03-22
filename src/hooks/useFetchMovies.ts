import {useCallback, useEffect, useRef, useState} from "react"
import axios from "axios"

type UseFetchMoviesReturn = readonly [
  fetching: () => Promise<void>,
  boolean,
      string | null,
  resetError: () => void
]

export const useFetchMovies = (
    callback: (signal: AbortSignal) => Promise<void>
): UseFetchMoviesReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const fetching = useCallback(async (): Promise<void> => {

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    const {signal} = controller

    try {
      setIsLoading(true)
      setError(null)
      await callbackRef.current(signal)
    } catch (e) {
      const isCanceled =
          signal.aborted ||
          axios.isCancel(e) ||
          (axios.isAxiosError(e) && e.code === "ERR_CANCELED")

      // Сохраняем ошибку, только если это не отмена
      if (!isCanceled) {
        setError(e instanceof Error ? e.message : String(e))
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    }
  }, [])

  const resetError = () => setError(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return [fetching, isLoading, error, resetError] as const
}
