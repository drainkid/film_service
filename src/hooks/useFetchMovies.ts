import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";

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

  // Всегда держим актуальный callback, но не дергаем из-за него fetching
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const fetching = useCallback(async (): Promise<void> => {
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller
    const { signal } = controller

    try {
      setIsLoading(true)
      setError(null)
      await callbackRef.current(signal)
    } catch (e) {
      const isCanceled =
        axios.isCancel(e) ||
        (axios.isAxiosError(e) && e.code === "ERR_CANCELED")

      if (!isCanceled) {
        setError(e instanceof Error ? e.message : String(e))
      }
    } finally {
      // Не обновляем loading для отмененного конкретного запроса
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  const resetError = () => setError(null)

  useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [])

  return [fetching, isLoading, error, resetError] as const
};