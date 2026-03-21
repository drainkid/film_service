import {useCallback, useRef} from 'react';

interface UseInfiniteScrollOptions {
    isLoading: boolean;
    hasMore: boolean;
    callback: () => void;
}

export const useInfiniteScroll = ({ isLoading, hasMore, callback }: UseInfiniteScrollOptions) => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                callback()
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore, callback])

    return [ lastElementRef ]
};