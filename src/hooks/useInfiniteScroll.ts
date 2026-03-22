import {useCallback, useEffect, useRef} from 'react'

interface UseInfiniteScrollOptions {
    isLoading: boolean
    hasMore: boolean
    callback: () => void
}

export const useInfiniteScroll = ({ isLoading, hasMore, callback }: UseInfiniteScrollOptions) => {
    const observer = useRef<IntersectionObserver | null>(null)

    const callbackRef = useRef(callback)
    const isLoadingRef = useRef(isLoading)
    const hasMoreRef = useRef(hasMore)

    useEffect(() => {
        callbackRef.current = callback
        isLoadingRef.current = isLoading
        hasMoreRef.current = hasMore
    }, [callback, isLoading, hasMore])

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting &&
                hasMoreRef.current &&
                !isLoadingRef.current
            ) {
                callbackRef.current()
            }
        }, {
            rootMargin: '0px 0px 600px 0px'
        })

        if (node) observer.current.observe(node)
    }, [])

    return [ lastElementRef ]
}
