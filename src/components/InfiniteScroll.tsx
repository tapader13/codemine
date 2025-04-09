'use client';
import { type ReactNode, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface InfiniteScrollProps {
  children: ReactNode;
  loadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  endMessage: ReactNode;
}

export default function InfiniteScroll({
  children,
  loadMore,
  hasMore,
  loading,
  endMessage,
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, options);

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <>
      {children}

      <Box
        ref={loadingRef}
        sx={{ display: 'flex', justifyContent: 'center', my: 4 }}
      >
        {loading && hasMore ? (
          <CircularProgress size={30} />
        ) : !hasMore && !loading ? (
          endMessage
        ) : null}
      </Box>
    </>
  );
}
